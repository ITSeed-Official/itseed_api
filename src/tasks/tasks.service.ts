import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { ApplicationsService } from "src/modules/applications/applications.service";

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Cron("0 8 * * *")
  etlCron() {
    this.applicationsService.transformData();
  }
}
