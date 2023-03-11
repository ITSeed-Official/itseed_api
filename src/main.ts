import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { LoggerConfig } from "./common/logger/LoggerConfig";
import { WinstonModule } from "nest-winston";
import basicAuth from "express-basic-auth";
import bodyParser from "body-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(new LoggerConfig().console()),
  });
  app.enableCors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://itseed.tw", "https://www.itseed.tw"]
        : [
            "http://localhost:3000",
            "https://itseed.tw",
            "https://www.itseed.tw",
          ],
    credentials: true,
  });
  app.use(bodyParser.text());
  app.use("/files", bodyParser.text({ limit: "5mb" }));
  app.use("/files", bodyParser.urlencoded({ extended: true, limit: "5mb" }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      disableErrorMessages: process.env.NODE_ENV === "production",
    })
  );
  app.use(
    ["/docs", "/docs-json"],
    basicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
      },
    })
  );

  const config = new DocumentBuilder()
    .setTitle("TechAndWatch - Watch Box")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
