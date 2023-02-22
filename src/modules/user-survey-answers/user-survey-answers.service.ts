import _ from "lodash";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserSurveyAnswerEntity } from "./entities/user-survey-answers.entity";
import { surveyQuestions, Question } from "./consts/const";
import { SurveyAnswer } from "../applications/dtos/update-application-payload.dto";
import { SurveyResult } from "./enums";

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
        question.answer = answer.answer;
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

  async isComplete(userId: number): Promise<boolean> {
    const answers: UserSurveyAnswerEntity[] = await this.surveyRepository.find({
      where: {
        userId: userId,
      },
    });

    const unCompleteQuestion = surveyQuestions.find((question: Question) => {
      const answer = answers.find((answer) => {
        return answer.number === question.number;
      });

      if (_.isNil(answer)) {
        return true;
      }

      return false;
    });

    return _.isNil(unCompleteQuestion) ? true : false;
  }

  async getSurveyResult(userId: number): Promise<SurveyResult> {
    const answers: UserSurveyAnswerEntity[] = await this.surveyRepository.find({
      where: {
        userId: userId,
      },
    });

    const maxanswer = _(answers)
      .map("answer")
      .countBy()
      .entries()
      .maxBy(_.last)
      .shift();

    switch (_.toNumber(maxanswer)) {
      case 1:
        return SurveyResult.D;
      case 2:
        return SurveyResult.I;
      case 3:
        return SurveyResult.S;
      case 4:
        return SurveyResult.C;
    }
  }
}
