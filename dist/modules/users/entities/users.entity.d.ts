import { Gender } from "../enum";
import { ResponseUserDto } from "../dto";
export declare class UserEntity {
    id: number;
    username: string;
    passwordHash: string;
    nickname: string;
    gender: Gender;
    city: string;
    avatar: string;
    isVerified: boolean;
    verifiedCode: string;
    verifiedAt: Date;
    lastVerifiedEmailAt: Date;
    resetPasswordCode: string;
    lastResetPasswordEmailAt: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    getResponse(): ResponseUserDto;
}
