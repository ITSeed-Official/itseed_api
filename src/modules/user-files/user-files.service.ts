import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserFileEntity } from "./entities/user-files.entity";
import { UserFiles as UserFilesDto } from "../applications/dtos/update-application-payload.dto";

interface File {
  path: string;
  name: string;
}

export interface UserFiles {
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

  async updateByUserId(userId: number, dto: UserFilesDto) {
    const updateData = [
      {
        type: "resume",
        userId: userId,
        name: dto.resume.name,
        path: dto.resume.path,
      },
      {
        type: "certification",
        userId: userId,
        name: dto.certification.name,
        path: dto.certification.path,
      },
    ];
    try {
      await this.userFileRepository.upsert(updateData, {
        conflictPaths: ["userId", "type"],
        skipUpdateIfNoValuesChanged: true,
      });
    } catch (error) {
      throw error;
    }
  }
}
