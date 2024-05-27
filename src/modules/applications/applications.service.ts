import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { google } from "googleapis";
import { UsersService } from "../users";
import _ from "lodash";
import moment from "moment";
import {
  REGISTRATION,
  USER_FILE_COMPLETION,
  USER_INFO_COMPLETION,
  USER_INTERVIEW_COMPLETION,
  USER_SURVEY_COMPLETION,
} from "../users/consts/const";
import { DiscordService } from "../notifications/discord/services/discord.service";
import { UserSurveyAnswersService } from "../user-survey-answers/user-survey-answers.service";
import { UserInterviewAnswersService } from "src/modules/user-interview-answers/user-interview-answers.service";
import { UserFilesService } from "src/modules/user-files/user-files.service";

@Injectable()
export class ApplicationsService {
  private clientEmail: string;
  private sheetId: string;
  private resultSheetId: string;
  private privateKey: string;
  private sheetScope: string;
  private chunkSize = 1000;
  private sheetRange = "Sheet1";
  private valueInputOption = "RAW";

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly userSurveyAnswersService: UserSurveyAnswersService,
    private readonly userInterviewAnswersService: UserInterviewAnswersService,
    private readonly userFilesService: UserFilesService,
    private readonly discordService: DiscordService
  ) {
    this.clientEmail = this.configService.get<string>("SHEET_CLIENT_EMAIL");
    this.sheetId = configService.get<string>("SHEET_ID");
    this.resultSheetId = configService.get<string>("RESULT_SHEET_ID");
    this.privateKey = configService.get<string>("SHEET_PRIVATE_KEY");
    this.sheetScope = configService.get<string>("SHEET_API_SCOPE");
    this.discordService = discordService;
  }

  async transformData() {
    const auth = new google.auth.JWT({
      email: this.clientEmail,
      key: this.privateKey,
      scopes: [this.sheetScope],
    });

    const sheet = google.sheets("v4");

    const users = await this.usersService.findAll();

    if (users.length === 0) {
      return;
    }

    await sheet.spreadsheets.values.clear({
      spreadsheetId: this.sheetId,
      auth: auth,
      range: this.sheetRange,
    });

    await sheet.spreadsheets.values.append({
      spreadsheetId: this.sheetId,
      auth: auth,
      range: this.sheetRange,
      valueInputOption: this.valueInputOption,
      requestBody: {
        values: [["ID", "姓名", "Email", "電話", "完成階段"]],
      },
    });

    _.chunk(users, this.chunkSize).forEach(async (chunkUsers) => {
      const insertDataPromise = chunkUsers.map(async (user) => {
        const userId = user.id;
        return [userId, user.nickname, user.email, user.phone, user.step];
      });

      const insertData = await Promise.all(insertDataPromise);

      await sheet.spreadsheets.values.append({
        spreadsheetId: this.sheetId,
        auth: auth,
        range: this.sheetRange,
        valueInputOption: this.valueInputOption,
        requestBody: {
          values: insertData,
        },
      });
    });
  }

  async snapshotUserStep() {
    const auth = new google.auth.JWT({
      email: this.clientEmail,
      key: this.privateKey,
      scopes: [this.sheetScope],
    });

    const sheet = google.sheets("v4");

    const record = await this.usersService.getStepCount();

    const now = moment().format("YYYY-MM-DD");

    await sheet.spreadsheets.values.append({
      spreadsheetId: this.sheetId,
      auth: auth,
      range: "Sheet2",
      valueInputOption: this.valueInputOption,
      requestBody: {
        values: [
          [
            now,
            record[REGISTRATION],
            record[USER_SURVEY_COMPLETION],
            record[USER_INFO_COMPLETION],
            record[USER_INTERVIEW_COMPLETION],
            record[USER_FILE_COMPLETION],
          ],
        ],
      },
    });

    const payload = {
      embeds: [
        {
          title: now,
          auth: {
            name: "公佈成績機器人",
          },
          fields: [
            {
              name: "完成註冊",
              value: record[REGISTRATION],
              inline: false,
            },
            {
              name: "完成 DISC",
              value: record[USER_SURVEY_COMPLETION],
              inline: false,
            },
            {
              name: "完成個人資料",
              value: record[USER_INFO_COMPLETION],
              inline: false,
            },
            {
              name: "完成書審",
              value: record[USER_INTERVIEW_COMPLETION],
              inline: false,
            },
            {
              name: "完成檔案上傳",
              value: record[USER_FILE_COMPLETION],
              inline: false,
            },
          ],
        },
      ],
    };

    await this.discordService.sendMessage(payload);
  }

  async transformSuccessUserData() {
    const auth = new google.auth.JWT({
      email: this.clientEmail,
      key: this.privateKey,
      scopes: [this.sheetScope],
    });

    const sheet = google.sheets("v4");

    const users = await this.usersService.findByStep(USER_FILE_COMPLETION);

    if (users.length === 0) {
      return;
    }

    await sheet.spreadsheets.values.clear({
      spreadsheetId: this.resultSheetId,
      auth: auth,
      range: "報名者資料",
    });

    await sheet.spreadsheets.values.append({
      spreadsheetId: this.resultSheetId,
      auth: auth,
      range: "報名者資料",
      valueInputOption: this.valueInputOption,
      requestBody: {
        values: [
          [
            "id",
            "姓名",
            "性別",
            "學校",
            "科系",
            "年級",
            "推薦人",
            "DISC",
            "履歷",
            "學生證明",
          ],
        ],
      },
    });

    await sheet.spreadsheets.values.clear({
      spreadsheetId: this.resultSheetId,
      auth: auth,
      range: "書審資料",
    });

    await sheet.spreadsheets.values.append({
      spreadsheetId: this.resultSheetId,
      auth: auth,
      range: "書審資料",
      valueInputOption: this.valueInputOption,
      requestBody: {
        values: [["id", "題目", "答案"]],
      },
    });

    const successUserIds: number[] = [10, 11, 13];

    _.chunk(users, this.chunkSize).forEach(async (chunkUsers) => {
      const insertDataPromise = chunkUsers.map(async (user) => {
        const userId = user.id;
        successUserIds.push(userId);

        const surveyResult =
          await this.userSurveyAnswersService.getSurveyResult(userId);

        const userFiles = await this.userFilesService.getUserFiles(userId);

        return [
          userId,
          user.nickname,
          user.gender,
          user.school,
          user.department,
          user.grade,
          user.recommender,
          surveyResult,
          userFiles.resume.path,
          userFiles.certification.path,
        ];
      });

      const insertData = await Promise.all(insertDataPromise);

      await sheet.spreadsheets.values.append({
        spreadsheetId: this.resultSheetId,
        auth: auth,
        range: "報名者資料",
        valueInputOption: this.valueInputOption,
        requestBody: {
          values: insertData,
        },
      });
    });

    const userInterviewAnswersData: any[] = [];

    for (const successUserId of successUserIds) {
      const interviewAnswers =
        await this.userInterviewAnswersService.getUserInterview(successUserId);

      const answerRows = await interviewAnswers.map((interviewAnswer) => {
        return [successUserId, interviewAnswer.title, interviewAnswer.answer];
      });

      await userInterviewAnswersData.push(answerRows);
    }

    await sheet.spreadsheets.values.append({
      spreadsheetId: this.resultSheetId,
      auth: auth,
      range: "書審資料",
      valueInputOption: this.valueInputOption,
      requestBody: {
        values: userInterviewAnswersData.flat(),
      },
    });
  }
}
