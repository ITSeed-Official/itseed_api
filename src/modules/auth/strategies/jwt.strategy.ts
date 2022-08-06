import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { isNil } from "lodash";
import { Request } from "express";
import { Reflector } from "@nestjs/core";
import { JwtPayload } from "../dtos/jwt-payload.dto";
import { UsersService } from "../../users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
    private userService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          // From Cookie
          const cookie = req?.headers?.cookie;
          this.logger.debug(`cookie: ${cookie}`);
          if (!isNil(cookie)) {
            const cookies = req?.headers?.cookie
              .split("; ")
              .map((s) => s.split("="))
              .reduce((result, [key, value]) => {
                result[key] = value;
                return result;
              }, {});
            this.logger.debug(`cookies: ${JSON.stringify(cookies, null, 2)}`);

            if (!isNil(cookies["access_token"])) {
              return cookies["access_token"];
            }
          }

          // From Authorization
          const Authorization = req.headers["authorization"];
          this.logger.debug(`Authorization: ${Authorization}`);
          if (!isNil(Authorization)) {
            return Authorization.split(" ")[1];
          }

          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("AUTH_JWT_SECRET"),
    });
  }

  async validate(payload: JwtPayload) {
    this.logger.debug(`The jwt payload: ${JSON.stringify(payload)}`);
    if (payload.isRefreshToken) {
      return payload;
    }

    const user = await this.userService.findOne(payload.id);
    if (isNil(user)) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
