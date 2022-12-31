import { Body, Controller, Get, Put, Res } from "@nestjs/common";
import { Response } from "express";
import { ApiBody, ApiHeader, ApiTags } from "@nestjs/swagger";
import { User, UserEntity, UsersService, Auth } from "src/modules";
import { UserFilesService } from "src/modules/user-files/user-files.service";
import { UserInterviewAnswersService } from "src/modules/user-interview-answers/user-interview-answers.service";
import { UserSurveyAnswersService } from "src/modules/user-survey-answers/user-survey-answers.service";
import { UpdateApplicationPayload } from "src/modules/applications/dtos/update-application-payload.dto";
import { isNil } from "lodash";

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
    @Body() dto: UpdateApplicationPayload
  ) {
    const userId = user.id;
    let targetStep = 0;

    const { info, survey, answer, files } = dto?.data;

    if (!isNil(survey)) {
      await this.userSurveyAnswersService.updateByUserId(userId, survey);
      targetStep = 1;
    }

    if (!isNil(info)) {
      await this.usersService.update(userId, info);
      targetStep = 2;
    }

    if (!isNil(answer)) {
      await this.userInterviewAnswersService.updateByUserId(userId, answer);
      targetStep = 3;
    }

    if (!isNil(files)) {
      await this.userFilesService.updateByUserId(userId, files);
      targetStep = 4;
    }

    await this.usersService.calculateSteps(userId, targetStep);
  }
}
