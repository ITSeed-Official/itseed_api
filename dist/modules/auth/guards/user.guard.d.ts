import { CanActivate, ExecutionContext } from "@nestjs/common";
export declare class UserGuard implements CanActivate {
    private readonly logger;
    canActivate(context: ExecutionContext): Promise<boolean>;
}
