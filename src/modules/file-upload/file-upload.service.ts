import { S3 } from "aws-sdk";
import { Logger, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import md5 from "md5";
import { FileUploadException } from "../../exceptions/file-upload.exceptions";
import { isNil } from "lodash";
import * as path from "path";

export class UploadResult {
  location: string;
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
    this.bucketS3 = configService.get<string>("AWS_S3_BUCKET");
  }

  async uploadTestFile(file: Express.Multer.File): Promise<UploadResult> {
    const { buffer, originalname, size } = file;
    const uploadName =
      md5(originalname + Date.now()) + path.extname(originalname);
    const filepath = `test/${uploadName}`;
    this.logger.log(`uploadTestFile: filepath:${filepath}, size:${size}`);
    return this.upload(buffer, { filepath });
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
