import _ from "lodash";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { interviewQuestions, Question } from "./consts/const";
import { UserInterviewAnswerEntity } from "./entities/user-interview-answers.entity";
import { InterviewAnswer } from "../applications/dtos/update-application-payload.dto";

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

  async updateByUserId(userId: number, data: InterviewAnswer[]) {
    const updateData = data.map((userInterviewAnswer) => {
      return {
        userId: userId,
        ...userInterviewAnswer,
      };
    });

    try {
      await this.interviewRepository.upsert(updateData, {
        conflictPaths: ["userId", "number"],
        skipUpdateIfNoValuesChanged: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async isComplete(userId: number): Promise<boolean> {
    const interviewAnswers = await this.interviewRepository.find({
      where: {
        userId: userId,
      },
    });

    const unCompleteQuestion = interviewQuestions.find(
      (interviewQuestion: Question) => {
        const answer = interviewAnswers.find((answer) => {
          return interviewQuestion.number === answer.number;
        });

        if (_.isNil(answer)) {
          return true;
        }

        if (this.getLength(answer.answer) > interviewQuestion.limit) {
          return true;
        }

        return false;
      }
    );

    return _.isNil(unCompleteQuestion) ? true : false;
  }

  getLength = (str: string) => {
    return str.replace(/[^\x00-\xff]/g, "O").length;
  };
}
