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

  @ApiResponseProperty()
  phone: string;

  @ApiResponseProperty()
  school: string;

  @ApiResponseProperty()
  department: string;

  @ApiResponseProperty()
  grade: number;

  @ApiResponseProperty()
  recommender: string;

  @ApiResponseProperty()
  referer: string[];
}
