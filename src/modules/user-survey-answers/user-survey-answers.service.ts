import _ from "lodash";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserSurveyAnswerEntity } from "./entities/user-survey-answers.entity";
import { surveyQuestions, Question } from "./consts/const";
import { SurveyAnswer } from "../applications/dtos/update-application-payload.dto";

@Injectable()
export class UserSurveyAnswersService {
  constructor(
    @InjectRepository(UserSurveyAnswerEntity)
    private readonly surveyRepository: Repository<UserSurveyAnswerEntity>
  ) {}

  async getUserSurvey(userId: number): Promise<Question[]> {
    const answers: UserSurveyAnswerEntity[] = await this.surveyRepository.find({
      where: {
        userId: userId,
      },
    });

    return surveyQuestions.map((question: Question) => {
      const answer = answers.find((answer) => {
        return answer.number === question.number;
      });

      if (!_.isNil(answer)) {
        question.answer = answer.answerNumber;
      }

      return question;
    });
  }

  async updateByUserId(userId: number, dto: SurveyAnswer[]) {
    const updateData = dto.map((surveyAnswer) => {
      return {
        userId: userId,
        ...surveyAnswer,
      };
    });

    try {
      await this.surveyRepository.upsert(updateData, {
        conflictPaths: ["userId", "number"],
        skipUpdateIfNoValuesChanged: true,
      });
    } catch (error) {
      throw error;
    }
  }
}
