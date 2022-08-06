import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { UserGuard } from "../guards/user.guard";
import { ApiBearerAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";

interface Options {
  skipEmailVerifyCheck?: boolean;
}

export function Auth(options?: Options) {
  const { skipEmailVerifyCheck } = options || {};
  return applyDecorators(
    SetMetadata("skipEmailVerifyCheck", skipEmailVerifyCheck),
    UseGuards(JwtAuthGuard, UserGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: "Unauthorized" })
  );
}
