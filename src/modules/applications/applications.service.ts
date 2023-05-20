import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { google } from "googleapis";
import { UsersService } from "../users";
import _ from "lodash";

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
    private readonly usersService: UsersService
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
}
