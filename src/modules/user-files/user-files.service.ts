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

    const userFilesHash: UserFiles = {
      resume: {
        name: null,
        path: null,
      },
      certification: {
        name: null,
        path: null,
      },
    };

    userFiles.forEach((userFile) => {
      userFilesHash[userFile.type] = {
        path: userFile.path,
        name: userFile.name,
      };
    });

    return userFilesHash;
  }

  async updateByUserId(userId: number, dto: UserFilesDto) {
    const updateData = [];

    if (dto.resume.path !== null) {
      updateData.push({
        type: "resume",
        userId: userId,
        name: dto.resume.name,
        path: dto.resume.path,
      });
    }
    if (dto.certification.path !== null) {
      updateData.push({
        type: "certification",
        userId: userId,
        name: dto.certification.name,
        path: dto.certification.path,
      });
    }

    try {
      await this.userFileRepository.upsert(updateData, {
        conflictPaths: ["userId", "type"],
        skipUpdateIfNoValuesChanged: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async isComplete(userId: number): Promise<boolean> {
    const userFiles = await this.userFileRepository.find({
      where: {
        userId: userId,
      },
    });

    const files = userFiles.filter((userFile) =>
      ["resume", "certification"].includes(userFile.type)
    );

    return files.length === 2 ? true : false;
  }
}
