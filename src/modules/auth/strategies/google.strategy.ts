import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { RawGoogleProfile, TransformedGoogleUser } from "../../../common/dtos";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>("GOOGLE_CLIENT_ID"),
      clientSecret: configService.get<string>("GOOGLE_SECRET"),
      callbackURL: `${configService.get<string>(
        "API_HOST"
      )}/auth/google/redirect`,
      scope: ["email", "profile"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: RawGoogleProfile,
    done: VerifyCallback
  ): Promise<any> {
    const { id, name, emails, photos } = profile;
    const user: TransformedGoogleUser = {
      id: id,
      displayName: profile.displayName,
      familyName: name.familyName,
      givenName: name.givenName,
      email: emails[0].value,
      emailVerified: emails[0].verified,
      avatar: photos[0].value,
      accessToken,
      refreshToken,
    };
    done(null, user);
  }
}
