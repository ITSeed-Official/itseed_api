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
    private readonly discordService: DiscordService
  ) {
    this.clientEmail = this.configService.get<string>("SHEET_CLIENT_EMAIL");
    this.sheetId = configService.get<string>("SHEET_ID");
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
}
