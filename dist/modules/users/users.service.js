"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("./entities");
const bcrypt = __importStar(require("bcryptjs"));
const lodash_1 = require("lodash");
let UsersService = UsersService_1 = class UsersService {
    constructor(usersRepository, googleUserRepository) {
        this.usersRepository = usersRepository;
        this.googleUserRepository = googleUserRepository;
        this.logger = new common_1.Logger(UsersService_1.name);
    }
    async hashPassword(password) {
        const salt = await bcrypt.genSalt(Number(process.env.AUTH_SALT_ROUNDS) || 10);
        const passwordHash = await bcrypt.hash(password, salt);
        return passwordHash;
    }
    async updateInfo(id, dto) {
        this.logger.debug(`User updated: ${id}`);
        return this.usersRepository.update(id, dto);
    }
    async updatePassword(id, password) {
        const passwordHash = await this.hashPassword(password);
        this.logger.debug(`User update password: userId: ${id}`);
        return this.usersRepository.update(id, { passwordHash });
    }
    async updateVerifyCode(id, code) {
        const result = await this.usersRepository.update({
            id,
            isVerified: false,
        }, {
            verifiedCode: code,
            lastVerifiedEmailAt: new Date(),
        });
        return result.affected === 1;
    }
    async updateResetPasswordCode(id, code) {
        const result = await this.usersRepository.update({
            id,
        }, {
            resetPasswordCode: code,
            lastResetPasswordEmailAt: new Date(),
        });
        return result.affected === 1;
    }
    async updateVerifyStatus(id, code) {
        const result = await this.usersRepository.update({
            id,
            verifiedCode: code,
            isVerified: false,
        }, {
            isVerified: true,
            verifiedAt: new Date(),
        });
        return result.affected === 1;
    }
    async findAll() {
        return this.usersRepository.find();
    }
    async findOne(id) {
        return this.usersRepository.findOne(id);
    }
    async findGoogleUserOne(googleId) {
        return this.googleUserRepository.findOne({
            where: {
                googleId,
            },
            relations: ["user"],
        });
    }
    async getOrCreateUserFromGoogle(rawUser) {
        let user = await this.findOneByUsername(rawUser.email);
        console.log(rawUser);
        if ((0, lodash_1.isNil)(user)) {
            user = this.usersRepository.create({
                username: rawUser.email,
                nickname: rawUser.givenName,
                passwordHash: "",
                isVerified: rawUser.emailVerified,
                avatar: rawUser.avatar,
            });
            user = await this.usersRepository.save(user);
        }
        let googleUser = await this.findGoogleUserOne(rawUser.id);
        if ((0, lodash_1.isNil)(googleUser)) {
            googleUser = this.googleUserRepository.create({
                googleId: rawUser.id,
                email: rawUser.email,
                emailVerified: rawUser.emailVerified,
                displayName: rawUser.displayName,
                familyName: rawUser.familyName,
                givenName: rawUser.givenName,
                avatar: rawUser.avatar,
                accessToken: rawUser.accessToken,
                user,
            });
            await this.googleUserRepository.save(googleUser);
        }
        return user;
    }
    async findByIds(ids) {
        return this.usersRepository.find({
            where: {
                id: ids,
            },
        });
    }
    async findOneByUsername(username) {
        return this.usersRepository.findOne({ username });
    }
};
UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.UserEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.GoogleUserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map