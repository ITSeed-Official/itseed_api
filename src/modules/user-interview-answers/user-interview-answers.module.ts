import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserInterviewAnswerEntity } from "./entities/user-interview-answers.entity";
import { UserInterviewAnswersService } from "./user-interview-answers.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserInterviewAnswerEntity])],
  providers: [UserInterviewAnswersService],
  exports: [UserInterviewAnswersService],
})
export class UserInterviewAnswersModule {}
