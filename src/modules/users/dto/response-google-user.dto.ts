import { ResponseUserDto } from './response-user.dto';
import { ApiResponseProperty } from '@nestjs/swagger';

export class ResponseGoogleUserDto {
  @ApiResponseProperty()
  id: number;

  @ApiResponseProperty()
  googleId: string;

  @ApiResponseProperty()
  email: string;

  @ApiResponseProperty()
  emailVerified: boolean;

  @ApiResponseProperty()
  displayName: string;

  @ApiResponseProperty()
  familyName: string;

  @ApiResponseProperty()
  givenName: string;

  @ApiResponseProperty()
  avatar: string;

  @ApiResponseProperty()
  user?: ResponseUserDto;
}
