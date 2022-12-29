import { Injectable, Logger } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./dtos/jwt-payload.dto";
import { UserEntity } from "../users";
import { TransformedGoogleUser } from "../../common/dtos";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  createToken({ id, email, scope }: JwtPayload): {
    access_token: string;
    refresh_token: string;
  } {
    const accessToken: JwtPayload = { id, email };
    if (scope) {
      accessToken.scope = scope;
    }
    return {
      access_token: this.jwtService.sign(accessToken, { expiresIn: "1d" }),
      refresh_token: this.jwtService.sign(
        { id, email, isRefreshToken: true },
        { expiresIn: "2d" }
      ),
    };
  }

  async getUserFromAuthenticationToken(token: string): Promise<UserEntity> {
    const { id }: JwtPayload = await this.jwtService.verify(token);
    this.logger.debug(`[getUserFromAuthenticationToken] userId: ${id}`);
    const user = await this.usersService.findOne(id);
    return user;
  }

  async createOrGetUserFromGoogle(
    rawGoogleUser: TransformedGoogleUser
  ): Promise<UserEntity> {
    const user = await this.usersService.getOrCreateUserFromGoogle(
      rawGoogleUser
    );
    return user;
  }
}
