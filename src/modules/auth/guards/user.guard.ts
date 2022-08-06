import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserEntity } from "../../users";
import { ErrorCode } from "../../../common/enum";
import { AuthService } from "../auth.service";

@Injectable()
export class UserGuard implements CanActivate {
  private readonly logger = new Logger(UserGuard.name);
  constructor(private reflector: Reflector, private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skipEmailVerifyCheck = this.reflector.get<boolean>(
      "skipEmailVerifyCheck",
      context.getHandler()
    );
    const request = context.switchToHttp().getRequest();
    const user: UserEntity = request.user;

    if (!user.isActive) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "此帳號目前被凍結，請聯絡客服進行進一步瞭解",
          errorCode: ErrorCode.AccountDisabled,
        },
        HttpStatus.FORBIDDEN
      );
    }
    return true;
  }
}
