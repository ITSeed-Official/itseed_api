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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
let AuthService = AuthService_1 = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    createToken({ id, username, scope }) {
        const accessToken = { id, username };
        if (scope) {
            accessToken.scope = scope;
        }
        return {
            access_token: this.jwtService.sign(accessToken, { expiresIn: "1d" }),
            refresh_token: this.jwtService.sign({ id, username, isRefreshToken: true }, { expiresIn: "2d" }),
        };
    }
    async getUserFromAuthenticationToken(token) {
        const { id } = await this.jwtService.verify(token);
        this.logger.debug(`[getUserFromAuthenticationToken] userId: ${id}`);
        const user = await this.usersService.findOne(id);
        return user;
    }
    async createOrGetUserFromGoogle(rawGoogleUser) {
        const user = await this.usersService.getOrCreateUserFromGoogle(rawGoogleUser);
        return user;
    }
};
AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map