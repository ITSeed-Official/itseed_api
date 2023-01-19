import {
  IsString,
  MaxLength,
  IsEnum,
  IsOptional,
  ValidateNested,
  IsInt,
  IsArray,
  Min,
  Max,
  IsNotEmptyObject,
  ArrayNotEmpty,
  MinLength,
} from "class-validator";
import { Gender } from "../../users/enum";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class UserInformation {
  @ApiProperty({ default: "陳資訊" })
  @IsString()
  @IsOptional()
  readonly nickname: string;

  @ApiProperty({ default: "male" })
  @IsEnum(Gender)
  @IsOptional()
  readonly gender: Gender;

  @ApiProperty({ default: "0912345678", maxLength: 10 })
  @MinLength(10)
  @MaxLength(10)
  @IsString()
  @IsOptional()
  readonly phone: string;

  @ApiProperty({ default: "資種大學" })
  @IsString()
  @IsOptional()
  readonly school: string;

  @ApiProperty({ default: "資種學系" })
  @IsString()
  @IsOptional()
  readonly department: string;

  @ApiProperty({ default: 2 })
  @IsInt()
  @IsOptional()
  readonly grade: number;

  @ApiProperty({ default: "林種子" })
  @IsString()
  @IsOptional()
  readonly recommender: string;

  @ApiProperty({ default: ["google", "facebook"] })
  @IsArray()
  @IsOptional()
  readonly referer: string[];
}

export class SurveyAnswer {
  @ApiProperty({ default: 1 })
  @IsInt()
  @Min(1)
  @Max(10)
  readonly number: number;

  @ApiProperty({ default: 1 })
  @IsInt()
  @Min(1)
  @Max(4)
  readonly answerNumber: number;
}

export class InterviewAnswer {
  @ApiProperty({ default: 1 })
  @IsInt()
  @Min(1)
  @Max(6)
  readonly number: number;

  @ApiProperty({ default: "我的回答" })
  @IsString()
  readonly answer: string;
}

class File {
  @ApiProperty({ default: "/file-path.pdf" })
  @IsString()
  readonly path: string;

  @ApiProperty({ default: "my file" })
  @IsString()
  readonly name: string;
}

export class UserFiles {
  @ApiProperty()
  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => File)
  readonly resume: File;

  @ApiProperty()
  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => File)
  readonly certification: File;
}

class Application {
  @ApiProperty()
  @ValidateNested()
  @IsOptional()
  @IsNotEmptyObject()
  @Type(() => UserInformation)
  readonly info: UserInformation;

  @ApiProperty()
  @ValidateNested()
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => SurveyAnswer)
  readonly survey: SurveyAnswer[];

  @ApiProperty()
  @ValidateNested()
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => InterviewAnswer)
  readonly answer: InterviewAnswer[];

  @ApiProperty()
  @ValidateNested()
  @IsOptional()
  @IsNotEmptyObject()
  @Type(() => UserFiles)
  readonly files: UserFiles;
}

export class UpdateApplicationPayload {
  @ApiProperty()
  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => Application)
  readonly data: Application;
}
