import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserFileEntity } from "./entities/user-files.entity";

interface File {
  path: string;
  name: string;
}

interface UserFiles {
  resume: File;
  certification: File;
}

@Injectable()
export class UserFilesService {
  constructor(
    @InjectRepository(UserFileEntity)
    private readonly userFileRepository: Repository<UserFileEntity>
  ) {}

  async getUserFiles(userId: number): Promise<UserFiles> {
    const userFiles = await this.userFileRepository.find({
      where: {
        userId: userId,
      },
    });

    const userFilesHash: UserFiles = {} as UserFiles;

    userFiles.forEach((userFile) => {
      userFilesHash[userFile.type] = {
        path: userFile.path,
        name: userFile.name,
      };
    });

    return userFilesHash;
  }
}
