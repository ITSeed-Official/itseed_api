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
} from "./controllers";
import { DatabaseLogger } from "./common/logger/DatabaseLogger";

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
  ],
  providers: [FileUploadService, MailService],
  controllers: [AuthController, UsersController, HealthController],
})
export class AppModule {}
