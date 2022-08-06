import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./dtos/jwt-payload.dto";
import { UserEntity } from "../users";
import { TransformedGoogleUser } from "../../common/dtos";
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly logger;
    constructor(usersService: UsersService, jwtService: JwtService);
    createToken({ id, username, scope }: JwtPayload): {
        access_token: string;
        refresh_token: string;
    };
    getUserFromAuthenticationToken(token: string): Promise<UserEntity>;
    createOrGetUserFromGoogle(rawGoogleUser: TransformedGoogleUser): Promise<UserEntity>;
}
