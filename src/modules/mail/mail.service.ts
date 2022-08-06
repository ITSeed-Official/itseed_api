import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import nodemailer from "nodemailer";
import { Transporter, SendMailOptions } from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid";

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transport: Transporter;
  private readonly fromEmail: string;

  constructor(private readonly configService: ConfigService) {
    this.transport = nodemailer.createTransport(
      nodemailerSendgrid({
        apiKey: this.configService.get<string>("SEND_GRID_KEY"),
      })
    );
    this.fromEmail = this.configService.get<string>("SENDER_EMAIL");
  }

  async send(mail: SendMailOptions) {
    this.logger.debug(`E-Mail sent to ${mail.to}, ${JSON.stringify(mail)}`);
    return this.transport.sendMail({
      ...mail,
      from: this.fromEmail,
    });
  }
}
