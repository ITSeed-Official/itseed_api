import { Module } from "@nestjs/common";
import { UserFilesService } from "./user-files.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserFileEntity } from "./entities/user-files.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserFileEntity])],
  providers: [UserFilesService],
  exports: [UserFilesService],
})
export class UserFilesModule {}
