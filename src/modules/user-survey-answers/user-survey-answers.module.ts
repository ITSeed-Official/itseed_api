import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserSurveyAnswersService } from "./user-survey-answers.service";
import { UserSurveyAnswerEntity } from "./entities/user-survey-answers.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserSurveyAnswerEntity])],
  providers: [UserSurveyAnswersService],
  exports: [UserSurveyAnswersService],
})
export class UserSurveyAnswersModule {}
