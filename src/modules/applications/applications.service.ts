import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { google } from "googleapis";
import { UserInterviewAnswersService } from "../user-interview-answers/user-interview-answers.service";
import { UserSurveyAnswersService } from "../user-survey-answers/user-survey-answers.service";
import { UsersService } from "../users";
import { UserFilesService } from "src/modules/user-files/user-files.service";
import _ from "lodash";
import { interviewQuestions } from "../user-interview-answers/consts/const";

@Injectable()
export class ApplicationsService {
  private clientEmail: string;
  private sheetId: string;
  private privateKey: string;
  private sheetScope: string;
  private chunkSize = 100;
  private sheetRange = "Sheet1";
  private valueInputOption = "RAW";

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly userSurveyAnswersService: UserSurveyAnswersService,
    private readonly userInterviewAnswersService: UserInterviewAnswersService,
    private readonly userFilesService: UserFilesService
  ) {
    this.clientEmail = this.configService.get<string>("SHEET_CLIENT_EMAIL");
    this.sheetId = configService.get<string>("SHEET_ID");
    this.privateKey = configService.get<string>("SHEET_PRIVATE_KEY");
    this.sheetScope = configService.get<string>("SHEET_API_SCOPE");
  }

  async transformData() {
    const auth = new google.auth.JWT({
      email: this.clientEmail,
      key: this.privateKey,
      scopes: [this.sheetScope],
    });

    const sheet = google.sheets("v4");

    const users = await this.usersService.findAll();

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
        values: [
          [
            "ID",
            "姓名",
            "Email",
            "電話",
            "性別",
            "學校",
            "系所",
            "年級",
            "DISC",
            ...interviewQuestions.map((question) => question.title),
            "履歷",
            "身分證明",
            "完成階段",
          ],
        ],
      },
    });

    _.chunk(users, this.chunkSize).forEach(async (chunkUsers) => {
      const insertDataPromise = chunkUsers.map(async (user) => {
        const userId = user.id;
        const surveyResult =
          await this.userSurveyAnswersService.getSurveyResult(userId);

        const interviewAnswer =
          await this.userInterviewAnswersService.getUserInterview(userId);

        const userFiles = await this.userFilesService.getUserFiles(userId);

        return [
          userId,
          user.nickname,
          user.email,
          user.phone,
          user.gender,
          user.school,
          user.department,
          user.grade,
          surveyResult,
          ...interviewAnswer.map((answer) => answer.answer),
          userFiles.resume.path,
          userFiles.certification.path,
          user.step,
        ];
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
}
