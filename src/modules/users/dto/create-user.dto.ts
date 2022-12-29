import {
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsNotEmpty,
  IsEnum,
  IsOptional,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Gender } from "../enum";

export class CreateUserDto {
  @IsEmail({}, { message: "請填入信箱作為你的帳號" })
  @ApiProperty({ default: "unique@example.com" })
  readonly email: string;

  @ApiProperty({ default: "12345678", minLength: 8 })
  @IsString()
  @MinLength(8, {
    message: "密碼至少需要 8 位",
  })
  @MaxLength(128, {
    message: "密碼至多 128 位",
  })
  readonly password: string;

  @ApiProperty({ default: "test-name" })
  @IsString()
  @IsNotEmpty()
  readonly nickname: string;

  @ApiProperty({ enum: Gender })
  @IsEnum(Gender)
  readonly gender: Gender;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly city: string;
}
