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
var JwtStrategy_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const passport_jwt_1 = require("passport-jwt");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const lodash_1 = require("lodash");
const core_1 = require("@nestjs/core");
const users_service_1 = require("../../users/users.service");
let JwtStrategy = JwtStrategy_1 = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(reflector, configService, userService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([
                (req) => {
                    var _a, _b;
                    const cookie = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.cookie;
                    this.logger.debug(`cookie: ${cookie}`);
                    if (!(0, lodash_1.isNil)(cookie)) {
                        const cookies = (_b = req === null || req === void 0 ? void 0 : req.headers) === null || _b === void 0 ? void 0 : _b.cookie.split("; ").map((s) => s.split("=")).reduce((result, [key, value]) => {
                            result[key] = value;
                            return result;
                        }, {});
                        this.logger.debug(`cookies: ${JSON.stringify(cookies, null, 2)}`);
                        if (!(0, lodash_1.isNil)(cookies["access_token"])) {
                            return cookies["access_token"];
                        }
                    }
                    const Authorization = req.headers["authorization"];
                    this.logger.debug(`Authorization: ${Authorization}`);
                    if (!(0, lodash_1.isNil)(Authorization)) {
                        return Authorization.split(" ")[1];
                    }
                    return null;
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get("AUTH_JWT_SECRET"),
        });
        this.reflector = reflector;
        this.configService = configService;
        this.userService = userService;
        this.logger = new common_1.Logger(JwtStrategy_1.name);
    }
    async validate(payload) {
        this.logger.debug(`The jwt payload: ${JSON.stringify(payload)}`);
        if (payload.isRefreshToken) {
            return payload;
        }
        const user = await this.userService.findOne(payload.id);
        if ((0, lodash_1.isNil)(user)) {
            throw new common_1.UnauthorizedException();
        }
        return user;
    }
};
JwtStrategy = JwtStrategy_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        config_1.ConfigService,
        users_service_1.UsersService])
], JwtStrategy);
exports.JwtStrategy = JwtStrategy;
//# sourceMappingURL=jwt.strategy.js.map