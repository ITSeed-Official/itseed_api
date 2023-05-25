import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class DiscordService {
  private webhookUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.webhookUrl = this.configService.get<string>(
      "DISCORD_DASHBOARD_WEBHOOK_URL"
    );
  }

  async sendMessage(payload: any): Promise<void> {
    await this.httpService.post(this.webhookUrl, payload).toPromise();
  }
}
