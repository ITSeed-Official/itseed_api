import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { UserEntity } from "../../users";
import { ErrorCode } from "../../../common/enum";

@Injectable()
export class UserGuard implements CanActivate {
  private readonly logger = new Logger(UserGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
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
