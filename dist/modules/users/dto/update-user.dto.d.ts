import { CreateUserDto } from "./create-user.dto";
declare const UpdateUserDto_base: import("@nestjs/common").Type<Partial<Omit<CreateUserDto, "username" | "password">>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
}
export {};
