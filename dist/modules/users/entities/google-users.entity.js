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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleUserEntity = void 0;
const typeorm_1 = require("typeorm");
const users_entity_1 = require("./users.entity");
let GoogleUserEntity = class GoogleUserEntity {
    getResponse() {
        return {
            id: this.id,
            googleId: this.googleId,
            email: this.email,
            emailVerified: this.emailVerified,
            displayName: this.displayName,
            familyName: this.familyName,
            givenName: this.givenName,
            avatar: this.avatar,
            user: this.user ? this.user.getResponse() : null,
        };
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], GoogleUserEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], GoogleUserEntity.prototype, "googleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], GoogleUserEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], GoogleUserEntity.prototype, "emailVerified", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GoogleUserEntity.prototype, "displayName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GoogleUserEntity.prototype, "familyName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GoogleUserEntity.prototype, "givenName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GoogleUserEntity.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => users_entity_1.UserEntity),
    (0, typeorm_1.JoinColumn)({ name: "userId" }),
    __metadata("design:type", users_entity_1.UserEntity)
], GoogleUserEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], GoogleUserEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GoogleUserEntity.prototype, "accessToken", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP(6)",
    }),
    __metadata("design:type", Date)
], GoogleUserEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP(6)",
        onUpdate: "CURRENT_TIMESTAMP(6)",
    }),
    __metadata("design:type", Date)
], GoogleUserEntity.prototype, "updatedAt", void 0);
GoogleUserEntity = __decorate([
    (0, typeorm_1.Index)("googleId", ["googleId"], { unique: true }),
    (0, typeorm_1.Entity)("google_users")
], GoogleUserEntity);
exports.GoogleUserEntity = GoogleUserEntity;
//# sourceMappingURL=google-users.entity.js.map