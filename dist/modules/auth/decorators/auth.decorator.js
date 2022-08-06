"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const user_guard_1 = require("../guards/user.guard");
const swagger_1 = require("@nestjs/swagger");
function Auth(options) {
    const { skipEmailVerifyCheck } = options || {};
    return (0, common_1.applyDecorators)((0, common_1.SetMetadata)("skipEmailVerifyCheck", skipEmailVerifyCheck), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, user_guard_1.UserGuard), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiUnauthorizedResponse)({ description: "Unauthorized" }));
}
exports.Auth = Auth;
//# sourceMappingURL=auth.decorator.js.map