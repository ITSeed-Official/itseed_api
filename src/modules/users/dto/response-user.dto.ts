import { ApiResponseProperty } from "@nestjs/swagger";
import { Gender } from "../enum";
import { GradeOption, RefererOption } from "../consts/const";

export class ResponseUserDto {
  @ApiResponseProperty()
  id: number;

  @ApiResponseProperty()
  email: string;

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
  grade: GradeOption[];

  @ApiResponseProperty()
  recommender: string;

  @ApiResponseProperty()
  referer: RefererOption[];

  @ApiResponseProperty()
  step: number;
}
