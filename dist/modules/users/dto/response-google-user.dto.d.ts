import { ResponseUserDto } from "./response-user.dto";
export declare class ResponseGoogleUserDto {
    id: number;
    googleId: string;
    email: string;
    emailVerified: boolean;
    displayName: string;
    familyName: string;
    givenName: string;
    avatar: string;
    user?: ResponseUserDto;
}
