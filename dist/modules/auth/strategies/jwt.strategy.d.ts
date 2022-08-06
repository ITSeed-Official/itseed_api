import { Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtPayload } from "../dtos/jwt-payload.dto";
import { UsersService } from "../../users/users.service";
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private reflector;
    private configService;
    private userService;
    private readonly logger;
    constructor(reflector: Reflector, configService: ConfigService, userService: UsersService);
    validate(payload: JwtPayload): Promise<import("../..").UserEntity | JwtPayload>;
}
export {};
