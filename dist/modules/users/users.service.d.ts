import { Repository } from "typeorm";
import { UserEntity, GoogleUserEntity } from "./entities";
import { UpdateUserDto } from "./dto";
import { TransformedGoogleUser } from "../../common/dtos";
export declare class UsersService {
    private readonly usersRepository;
    private readonly googleUserRepository;
    private readonly logger;
    constructor(usersRepository: Repository<UserEntity>, googleUserRepository: Repository<GoogleUserEntity>);
    private hashPassword;
    updateInfo(id: number, dto: UpdateUserDto): Promise<import("typeorm").UpdateResult>;
    updatePassword(id: number, password: string): Promise<import("typeorm").UpdateResult>;
    updateVerifyCode(id: number, code: string): Promise<boolean>;
    updateResetPasswordCode(id: number, code: string): Promise<boolean>;
    updateVerifyStatus(id: number, code: string): Promise<boolean>;
    findAll(): Promise<UserEntity[]>;
    findOne(id: number): Promise<UserEntity>;
    findGoogleUserOne(googleId: string): Promise<GoogleUserEntity>;
    getOrCreateUserFromGoogle(rawUser: TransformedGoogleUser): Promise<UserEntity>;
    findByIds(ids: number[]): Promise<UserEntity[]>;
    findOneByUsername(username: string): Promise<UserEntity>;
}
