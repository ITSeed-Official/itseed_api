import { IsEnum, IsString } from "class-validator";
import { Type } from "../enum";
import { ApiProperty } from "@nestjs/swagger";

export class CreateFilePayload {
  @ApiProperty({ default: "resume" })
  @IsEnum(Type)
  readonly type: Type;

  @ApiProperty({ default: "resume file name" })
  @IsString()
  readonly name: string;
}
