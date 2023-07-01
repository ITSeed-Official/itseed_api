import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ApplicationsService } from "src/modules/applications/applications.service";
import moment from "moment";
import { END_TIME, START_TIME } from "src/modules/users/consts/const";

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Cron(CronExpression.EVERY_2_HOURS)
  etlCron() {
    this.applicationsService.transformData();
  }

  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  snapshotUserStepCron() {
    const startDate = moment(START_TIME, "YYYY-MM-DD HH:mm:ss");
    const endDate = moment(END_TIME, "YYYY-MM-DD HH:mm:ss");
    const now = moment();

    if (!now.isBetween(startDate, endDate)) {
      return;
    }

    this.applicationsService.snapshotUserStep();
  }

  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  transformSuccessUserDataCron() {
    const startDate = moment(START_TIME, "YYYY-MM-DD HH:mm:ss");
    const endDate = moment(END_TIME, "YYYY-MM-DD HH:mm:ss").add(2, "days");
    const now = moment();

    if (!now.isBetween(startDate, endDate)) {
      return;
    }

    this.applicationsService.transformSuccessUserData();
  }
}
