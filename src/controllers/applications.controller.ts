import { Body, Controller, Get, Put, Res } from "@nestjs/common";
import { Response } from "express";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { User, UserEntity, UsersService, Auth } from "src/modules";
import { UserFilesService } from "src/modules/user-files/user-files.service";
import { UserInterviewAnswersService } from "src/modules/user-interview-answers/user-interview-answers.service";
import { UserSurveyAnswersService } from "src/modules/user-survey-answers/user-survey-answers.service";
import { UpdateApplicationPayload } from "src/modules/applications/dtos/update-application-payload.dto";
import { isNil } from "lodash";

@ApiTags("auth")
@Controller("applications")
export class ApplicationsController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userSurveyAnswersService: UserSurveyAnswersService,
    private readonly userInterviewAnswersService: UserInterviewAnswersService,
    private readonly userFilesService: UserFilesService
  ) {}

  @Auth()
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
  @Put("me")
  async update(
    @User() user: UserEntity,
    @Body() dto: UpdateApplicationPayload
  ) {
    const userId = user.id;

    const { info, survey, answer, files } = dto?.data;

    if (!isNil(info)) {
      await this.usersService.update(userId, info);
    }

    if (!isNil(survey)) {
      await this.userSurveyAnswersService.updateByUserId(userId, survey);
    }

    if (!isNil(answer)) {
      await this.userInterviewAnswersService.updateByUserId(userId, answer);
    }

    if (!isNil(files)) {
      await this.userFilesService.updateByUserId(userId, files);
    }
  }
}
