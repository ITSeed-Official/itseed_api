import _ from "lodash";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { interviewQuestions, Question } from "./consts/const";
import { UserInterviewAnswerEntity } from "./entities/user-interview-answers.entity";

@Injectable()
export class UserInterviewAnswersService {
  constructor(
    @InjectRepository(UserInterviewAnswerEntity)
    private readonly interviewRepository: Repository<UserInterviewAnswerEntity>
  ) {}

  async getUserInterview(userId: number): Promise<Question[]> {
    const interviewAnswers = await this.interviewRepository.find({
      where: {
        userId: userId,
      },
    });

    return interviewQuestions.map((interviewQuestion: Question) => {
      const answer = interviewAnswers.find((answer) => {
        return interviewQuestion.number === answer.number;
      });

      if (!_.isNil(answer)) {
        interviewQuestion.answer = answer.answer;
      }

      return interviewQuestion;
    });
  }
}
