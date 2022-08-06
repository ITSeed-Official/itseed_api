import { ConfigService } from "@nestjs/config";
import { SendMailOptions } from "nodemailer";
export declare class MailService {
    private readonly configService;
    private readonly logger;
    private readonly transport;
    private readonly fromEmail;
    constructor(configService: ConfigService);
    send(mail: SendMailOptions): Promise<any>;
}
