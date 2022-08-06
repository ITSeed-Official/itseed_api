import { ApiResponseProperty } from "@nestjs/swagger";
import { Gender } from "../enum";

export class ResponseUserDto {
  @ApiResponseProperty()
  id: number;

  @ApiResponseProperty()
  username: string;

  @ApiResponseProperty()
  nickname: string;

  @ApiResponseProperty()
  city: string;

  @ApiResponseProperty()
  gender: Gender;

  @ApiResponseProperty()
  avatar: string;
}
