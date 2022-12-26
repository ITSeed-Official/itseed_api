import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import {
  UsersModule,
  AuthModule,
  FileUploadService,
  MailService,
} from "./modules";
import {
  AuthController,
  UsersController,
  HealthController,
  ApplicationsController,
  FilesController,
} from "./controllers";
import { DatabaseLogger } from "./common/logger/DatabaseLogger";
import { UserSurveyAnswersModule } from "./modules/user-survey-answers/user-survey-answers.module";
import { UserInterviewAnswersModule } from "./modules/user-interview-answers/user-interview-answers.module";
import { UserFilesModule } from "./modules/user-files/user-files.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true,
      ...(process.env.NODE_ENV === "development"
        ? {
            logger: new DatabaseLogger(),
          }
        : {}),
    }),
    UsersModule,
    AuthModule,
    UserSurveyAnswersModule,
    UserInterviewAnswersModule,
    UserFilesModule,
  ],
  providers: [FileUploadService, MailService],
  controllers: [
    AuthController,
    UsersController,
    HealthController,
    ApplicationsController,
    FilesController,
  ],
})
export class AppModule {}
