"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const modules_1 = require("./modules");
const controllers_1 = require("./controllers");
const DatabaseLogger_1 = require("./common/logger/DatabaseLogger");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot(Object.assign({ type: "mysql", host: process.env.DB_HOST, port: parseInt(process.env.DB_PORT) || 3306, username: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME, entities: [__dirname + "/**/*.entity{.ts,.js}"], synchronize: true }, (process.env.NODE_ENV === "development"
                ? {
                    logger: new DatabaseLogger_1.DatabaseLogger(),
                }
                : {}))),
            modules_1.UsersModule,
            modules_1.AuthModule,
        ],
        providers: [modules_1.FileUploadService, modules_1.MailService],
        controllers: [controllers_1.AuthController, controllers_1.UsersController, controllers_1.HealthController],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map