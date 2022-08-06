import { ConfigService } from "@nestjs/config";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { RawGoogleProfile } from "../../../common/dtos";
declare const GoogleStrategy_base: new (...args: any[]) => Strategy;
export declare class GoogleStrategy extends GoogleStrategy_base {
    private configService;
    constructor(configService: ConfigService);
    validate(accessToken: string, refreshToken: string, profile: RawGoogleProfile, done: VerifyCallback): Promise<any>;
}
export {};
