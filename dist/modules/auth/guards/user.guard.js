"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var UserGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserGuard = void 0;
const common_1 = require("@nestjs/common");
const enum_1 = require("../../../common/enum");
let UserGuard = UserGuard_1 = class UserGuard {
    constructor() {
        this.logger = new common_1.Logger(UserGuard_1.name);
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user.isActive) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.FORBIDDEN,
                error: "此帳號目前被凍結，請聯絡客服進行進一步瞭解",
                errorCode: enum_1.ErrorCode.AccountDisabled,
            }, common_1.HttpStatus.FORBIDDEN);
        }
        return true;
    }
};
UserGuard = UserGuard_1 = __decorate([
    (0, common_1.Injectable)()
], UserGuard);
exports.UserGuard = UserGuard;
//# sourceMappingURL=user.guard.js.map