import { S3 } from "aws-sdk";
import { Logger, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FileUploadException } from "../../exceptions/file-upload.exceptions";
import { isNil } from "lodash";
import * as path from "path";
import { CreateFilePayload } from "./dtos/create-file-payload.dto";

export class UploadResult {
  location: string;
  filePath: string;
}

interface S3UploadedResult {
  Location: string;
}

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);
  private readonly bucketS3: string;
  private readonly cdnHost: string;
  constructor(private configService: ConfigService) {
    this.bucketS3 = configService.get<string>("AWS_CLOUDFRONT");
  }

  async execute(
    file: Express.Multer.File,
    userId: number,
    dto: CreateFilePayload
  ): Promise<UploadResult> {
    const { buffer, originalname, size } = file;
    const uploadName = dto.type + path.extname(originalname);
    const filepath = `${this.getFolderName()}/${userId}/${uploadName}`;
    this.logger.log(`uploadTestFile: filepath:${filepath}, size:${size}`);
    return this.upload(buffer, { filepath });
  }

  private getFolderName() {
    return process.env.NODE_ENV === "production" ? "production" : "test";
  }

  private async upload(
    fileBuffer: Buffer,
    { filepath }: { filepath: string }
  ): Promise<UploadResult> {
    try {
      this.logger.debug(`upload - filepath:${filepath}`);
      const result: S3UploadedResult = await this.uploadS3(
        fileBuffer,
        this.bucketS3,
        filepath
      );
      if (isNil(result.Location)) {
        throw new Error("Uploaded path not found.");
      }
      this.logger.debug(`uploaded - result:${JSON.stringify(result)}`);
      const s3Location = result.Location;
      const cdnLocation = "";
      return {
        location: cdnLocation || s3Location,
        filePath: filepath,
      };
    } catch (e) {
      throw new FileUploadException(e);
    }
  }

  private async uploadS3(
    file: Buffer,
    bucket: string,
    name: string
  ): Promise<S3UploadedResult> {
    const s3 = this.getS3();
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
    };
    return new Promise((resolve, reject) => {
      s3.upload(params, (err: Error, data: any) => {
        if (err) {
          this.logger.error(err);
          reject(err.message);
        }
        resolve(data);
      });
    });
  }

  private getS3() {
    return new S3({
      accessKeyId: this.configService.get<string>("AWS_ACCESS_KEY_ID"),
      secretAccessKey: this.configService.get<string>("AWS_SECRET_ACCESS_KEY"),
    });
  }
}
