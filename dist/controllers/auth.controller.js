"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const modules_1 = require("../modules");
const dtos_1 = require("../common/dtos");
let AuthController = AuthController_1 = class AuthController {
    constructor(configService, authService) {
        this.configService = configService;
        this.authService = authService;
        this.logger = new common_1.Logger(AuthController_1.name);
    }
    async logout(response) {
        const settings = this.configService.get("NODE_ENV") === "production"
            ? {
                sameSite: "none",
                secure: true,
            }
            : this.configService.get("NODE_ENV") === "staging"
                ? {
                    sameSite: "none",
                    secure: true,
                }
                : {};
        response
            .clearCookie("access_token", settings)
            .clearCookie("refresh_token", settings)
            .json({ message: "success" });
    }
    async googleAuth() {
        return "redirect to google";
    }
    async googleAuthRedirect(googleUser, response) {
        this.logger.debug(`[googleAuthRedirect] googleUser: ${JSON.stringify(googleUser, null, 2)}`);
        if (!googleUser) {
            return "No user from google";
        }
        const user = await this.authService.createOrGetUserFromGoogle(googleUser);
        this.logger.debug(`[googleAuthRedirect] user: ${JSON.stringify(user, null, 2)}`);
        const result = await this.authService.createToken(user);
        this.logger.debug(`google.redirect result: ${JSON.stringify(result, null, 2)}`);
        this.responseSetCookie(response, result.access_token, result.refresh_token).redirect(`${this.configService.get("FRONTEND_HOST")}/apply`);
    }
    responseSetCookie(response, accessToken, refreshToken) {
        const settings = this.configService.get("NODE_ENV") === "production"
            ? {
                sameSite: "none",
                secure: true,
            }
            : this.configService.get("NODE_ENV") === "staging"
                ? {
                    sameSite: "none",
                    secure: true,
                }
                : {};
        return response
            .cookie("access_token", accessToken, Object.assign({ httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }, settings))
            .cookie("refresh_token", refreshToken, Object.assign({ httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 }, settings));
    }
};
__decorate([
    (0, common_1.UseGuards)(modules_1.JwtAuthGuard),
    (0, common_1.Post)("logout"),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)("google"),
    (0, common_1.UseGuards)(modules_1.GoogleAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)("google/redirect"),
    (0, common_1.UseGuards)(modules_1.GoogleAuthGuard),
    __param(0, (0, modules_1.User)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.TransformedGoogleUser, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthRedirect", null);
AuthController = AuthController_1 = __decorate([
    (0, swagger_1.ApiTags)("auth"),
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [config_1.ConfigService,
        modules_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map