"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const LoggerConfig_1 = require("./common/logger/LoggerConfig");
const nest_winston_1 = require("nest-winston");
const express_basic_auth_1 = __importDefault(require("express-basic-auth"));
const body_parser_1 = __importDefault(require("body-parser"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: nest_winston_1.WinstonModule.createLogger(new LoggerConfig_1.LoggerConfig().console()),
    });
    app.enableCors({
        origin: process.env.NODE_ENV === "production"
            ? ["https://itseed.tw", "https://www.itseed.tw"]
            : process.env.NODE_ENV === "staging"
                ? ["https://stage.itseed.tw"]
                : [
                    "http://localhost:3000",
                    "https://itseed.tw",
                    "https://www.itseed.tw",
                    "https://stage.itseed.tw",
                ],
        credentials: true,
    });
    app.use(body_parser_1.default.text());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        disableErrorMessages: process.env.NODE_ENV === "production",
    }));
    app.use(["/docs", "/docs-json"], (0, express_basic_auth_1.default)({
        challenge: true,
        users: {
            [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
        },
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle("TechAndWatch - Watch Box")
        .setVersion("1.0")
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup("docs", app, document);
    await app.listen(process.env.PORT || 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map