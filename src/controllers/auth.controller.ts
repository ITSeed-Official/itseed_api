import {
  Controller,
  Post,
  Res,
  UseGuards,
  Logger,
  Get,
  HttpStatus,
} from "@nestjs/common";
import { Response, CookieOptions } from "express";
import { ConfigService } from "@nestjs/config";
import { ApiTags } from "@nestjs/swagger";
import { User, AuthService, JwtAuthGuard, GoogleAuthGuard } from "../modules";
import { TransformedGoogleUser } from "../common/dtos";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  async logout(@Res() response: Response) {
    const settings: CookieOptions =
      this.configService.get<string>("NODE_ENV") === "production"
        ? {
            sameSite: "none",
            secure: true,
          }
        : this.configService.get<string>("NODE_ENV") === "staging"
        ? {
            sameSite: "none",
            secure: true,
          }
        : {};
    response
      .clearCookie("access_token", settings)
      .clearCookie("refresh_token", settings)
      .json({ message: "success" });
  }

  @Get("google")
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    return "redirect to google";
  }

  @Get("google/redirect")
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(
    @User() googleUser: TransformedGoogleUser,
    @Res() response: Response
  ) {
    this.logger.debug(
      `[googleAuthRedirect] googleUser: ${JSON.stringify(googleUser, null, 2)}`
    );
    if (!googleUser) {
      return "No user from google";
    }
    try {
      const user = await this.authService.createOrGetUserFromGoogle(googleUser);
      this.logger.debug(
        `[googleAuthRedirect] user: ${JSON.stringify(user, null, 2)}`
      );
      const result = await this.authService.createToken(user);
      this.logger.debug(
        `google.redirect result: ${JSON.stringify(result, null, 2)}`
      );

      this.responseSetCookie(
        response,
        result.access_token,
        result.refresh_token
      ).redirect(`${this.configService.get<string>("FRONTEND_HOST")}/apply`);
    } catch (error) {
      console.log("[google auth error]", error);
      response.status(HttpStatus.BAD_REQUEST).json({
        error: {
          message: error,
        },
      });
    }
  }

  private responseSetCookie(
    response: Response,
    accessToken: string,
    refreshToken: string
  ): Response {
    const settings: CookieOptions =
      this.configService.get<string>("NODE_ENV") === "production"
        ? {
            sameSite: "none",
            secure: true,
          }
        : this.configService.get<string>("NODE_ENV") === "staging"
        ? {
            sameSite: "none",
            secure: true,
          }
        : {};
    return response
      .cookie("access_token", accessToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        ...settings,
      })
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        ...settings,
      });
  }
}
