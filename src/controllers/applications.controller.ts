import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Put,
  Req,
  Res,
} from "@nestjs/common";
import { Request, Response } from "express";
import { ApiBody, ApiHeader, ApiTags } from "@nestjs/swagger";
import { User, UserEntity, UsersService, Auth } from "src/modules";
import { UserFilesService } from "src/modules/user-files/user-files.service";
import { UserInterviewAnswersService } from "src/modules/user-interview-answers/user-interview-answers.service";
import { UserSurveyAnswersService } from "src/modules/user-survey-answers/user-survey-answers.service";
import { UpdateApplicationPayload } from "src/modules/applications/dtos/update-application-payload.dto";
import { isNil } from "lodash";
import moment from "moment";
import { END_TIME, START_TIME } from "src/modules/users/consts/const";

@ApiTags("applications")
@Controller("applications")
export class ApplicationsController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userSurveyAnswersService: UserSurveyAnswersService,
    private readonly userInterviewAnswersService: UserInterviewAnswersService,
    private readonly userFilesService: UserFilesService
  ) {}

  @Auth()
  @ApiHeader({
    name: "Cookie",
    description: "Try to set cookie.",
  })
  @Get("me")
  async getMine(@User() user: UserEntity, @Res() response: Response) {
    const userId = user.id;
    const userSurveyAnswers = await this.userSurveyAnswersService.getUserSurvey(
      userId
    );
    const userInterviewAnswers =
      await this.userInterviewAnswersService.getUserInterview(userId);
    const userFiles = await this.userFilesService.getUserFiles(userId);

    response.json({
      data: {
        info: user.getResponse(),
        survey: userSurveyAnswers,
        answer: userInterviewAnswers,
        files: userFiles,
      },
    });
  }

  @Auth()
  @ApiBody({ type: UpdateApplicationPayload })
  @ApiHeader({
    name: "Cookie",
    description: "Try to set cookie.",
  })
  @Put("me")
  async update(
    @User() user: UserEntity,
    @Body() dto: UpdateApplicationPayload,
    @Req() request: Request,
    @Res() response: Response
  ) {
    const startDate = moment(START_TIME);
    const endDate = moment(END_TIME);
    const now = moment();
    const devMode = this.getCookie(process.env.DEV_MODE, request);

    if (!now.isBetween(startDate, endDate) && devMode !== "true") {
      response.status(HttpStatus.BAD_REQUEST).json({
        error: {
          message: "報名時間截止",
        },
      });
    }
    const userId = user.id;

    const { info, survey, answer, files } = dto?.data;

    if (!isNil(survey)) {
      await this.userSurveyAnswersService.updateByUserId(userId, survey);
    }

    if (!isNil(info)) {
      await this.usersService.update(userId, info);
    }

    if (!isNil(answer)) {
      await this.userInterviewAnswersService.updateByUserId(userId, answer);
    }

    if (!isNil(files)) {
      await this.userFilesService.updateByUserId(userId, files);
    }

    const isUserSurveyComplete = await this.userSurveyAnswersService.isComplete(
      userId
    );

    const isUserInfoComplete = await this.usersService.isComplete(userId);

    const isUserInterviewComplete =
      await this.userInterviewAnswersService.isComplete(userId);

    const isUserFilesComplete = await this.userFilesService.isComplete(userId);

    let targetStep = this.getCurrentStep([
      isUserSurveyComplete,
      isUserInfoComplete,
      isUserInterviewComplete,
    ]);

    const isAllFilledIn = [survey, info, answer, files].every(
      (data) => !isNil(data)
    );

    const errors = [];

    if (isAllFilledIn) {
      if (!isUserSurveyComplete) {
        errors.push("DISC");
      }
      if (!isUserInfoComplete) {
        errors.push("個人資料");
      }
      if (!isUserInterviewComplete) {
        errors.push("書審");
      }
      if (!isUserFilesComplete) {
        errors.push("檔案");
      }

      if (errors.length > 0) {
        throw new HttpException(
          `${errors.join(",")} 未填寫完整或不符合規定`,
          HttpStatus.BAD_REQUEST
        );
      } else {
        targetStep = 4;
      }
    }

    await this.usersService.calculateSteps(userId, targetStep);

    response.json();
  }

  getCookie(key: string, request: Request): string {
    const cookie = request?.headers?.cookie;
    if (isNil(cookie)) {
      return "";
    }
    const cookies: { [key: string]: string } = cookie
      .split("; ")
      .map((s: string) => s.split("="))
      .reduce((result: { [key: string]: string }, [key, value]) => {
        result[key] = value;
        return result;
      }, {});

    return cookies[key] ?? "";
  }

  getCurrentStep(isCompleteList: boolean[]) {
    let targetStep = 0;

    for (const isComplete of isCompleteList) {
      if (isComplete) {
        targetStep += 1;
      } else {
        break;
      }
    }

    return targetStep;
  }
}
