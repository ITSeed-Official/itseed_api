import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import { UserEntity, GoogleUserEntity } from "./entities";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, GoogleUserEntity])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
