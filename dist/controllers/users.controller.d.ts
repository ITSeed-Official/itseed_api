import { UsersService, UpdateUserDto, UserEntity } from "../modules";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findMe(user: UserEntity): Promise<UserEntity>;
    update(userId: number, dto: UpdateUserDto): Promise<string>;
}
