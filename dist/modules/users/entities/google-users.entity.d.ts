import { UserEntity } from "./users.entity";
import { ResponseGoogleUserDto } from "../dto";
export declare class GoogleUserEntity {
    id: number;
    googleId: string;
    email: string;
    emailVerified: boolean;
    displayName: string;
    familyName: string;
    givenName: string;
    avatar: string;
    user: UserEntity;
    userId: number;
    accessToken: string;
    createdAt: Date;
    updatedAt: Date;
    getResponse(): ResponseGoogleUserDto;
}
