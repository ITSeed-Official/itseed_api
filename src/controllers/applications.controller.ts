import { Controller, Get, Patch, Res } from "@nestjs/common";
import { Response } from "express";
import { ApiTags } from "@nestjs/swagger";
import { User, UserEntity, UsersService, Auth } from "src/modules";
import { UserFilesService } from "src/modules/user-files/user-files.service";
import { UserInterviewAnswersService } from "src/modules/user-interview-answers/user-interview-answers.service";
import { UserSurveyAnswersService } from "src/modules/user-survey-answers/user-survey-answers.service";

@ApiTags("auth")
@Controller("applications")
export class ApplicationsController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userSurveyAnswersService: UserSurveyAnswersService,
    private readonly userInterviewAnswersService: UserInterviewAnswersService,
    private readonly userFilesService: UserFilesService
  ) {}

  @Get("me")
  @Auth()
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
}
