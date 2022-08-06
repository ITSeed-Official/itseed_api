/// <reference types="multer" />
import { ConfigService } from "@nestjs/config";
export declare class UploadResult {
    location: string;
}
export declare class FileUploadService {
    private configService;
    private readonly logger;
    private readonly bucketS3;
    private readonly cdnHost;
    constructor(configService: ConfigService);
    uploadTestFile(file: Express.Multer.File): Promise<UploadResult>;
    private upload;
    private uploadS3;
    private getS3;
}
