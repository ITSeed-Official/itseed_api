import { Gender } from "../enum";
export declare class CreateUserDto {
    readonly username: string;
    readonly password: string;
    readonly nickname: string;
    readonly gender: Gender;
    readonly city: string;
}
