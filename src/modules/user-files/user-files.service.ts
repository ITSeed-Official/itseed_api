import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserFileEntity } from "./entities/user-files.entity";
import { UserFiles as UserFilesDto } from "../applications/dtos/update-application-payload.dto";
import { ConfigService } from "@nestjs/config";

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
  private readonly awsUrl: string;

  constructor(
    @InjectRepository(UserFileEntity)
    private readonly userFileRepository: Repository<UserFileEntity>,
    private readonly configService: ConfigService
  ) {
    this.awsUrl = this.configService.get<string>("AWS_CLOUDFRONT");
  }

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
        path: `${this.awsUrl}${userFile.path}`,
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
