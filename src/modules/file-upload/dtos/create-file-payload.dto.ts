import { IsEnum } from "class-validator";
import { Type } from "../enum";
import { ApiProperty } from "@nestjs/swagger";

export class CreateFilePayload {
  @ApiProperty({ default: "resume" })
  @IsEnum(Type)
  readonly type: Type;
}
