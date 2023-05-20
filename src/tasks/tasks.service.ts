import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ApplicationsService } from "src/modules/applications/applications.service";

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  etlCron() {
    console.debug("start cronjob");
    this.applicationsService.transformData();
  }
}
