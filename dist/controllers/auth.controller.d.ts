import { Response } from "express";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../modules";
import { TransformedGoogleUser } from "../common/dtos";
export declare class AuthController {
    private readonly configService;
    private readonly authService;
    private readonly logger;
    constructor(configService: ConfigService, authService: AuthService);
    logout(response: Response): Promise<void>;
    googleAuth(): Promise<string>;
    googleAuthRedirect(googleUser: TransformedGoogleUser, response: Response): Promise<string>;
    private responseSetCookie;
}
