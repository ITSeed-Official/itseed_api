"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var FileUploadService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadService = exports.UploadResult = void 0;
const aws_sdk_1 = require("aws-sdk");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const md5_1 = __importDefault(require("md5"));
const file_upload_exceptions_1 = require("../../exceptions/file-upload.exceptions");
const lodash_1 = require("lodash");
const path = __importStar(require("path"));
class UploadResult {
}
exports.UploadResult = UploadResult;
let FileUploadService = FileUploadService_1 = class FileUploadService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(FileUploadService_1.name);
        this.bucketS3 = configService.get("AWS_S3_BUCKET");
    }
    async uploadTestFile(file) {
        const { buffer, originalname, size } = file;
        const uploadName = (0, md5_1.default)(originalname + Date.now()) + path.extname(originalname);
        const filepath = `test/${uploadName}`;
        this.logger.log(`uploadTestFile: filepath:${filepath}, size:${size}`);
        return this.upload(buffer, { filepath });
    }
    async upload(fileBuffer, { filepath }) {
        try {
            this.logger.debug(`upload - filepath:${filepath}`);
            const result = await this.uploadS3(fileBuffer, this.bucketS3, filepath);
            if ((0, lodash_1.isNil)(result.Location)) {
                throw new Error("Uploaded path not found.");
            }
            this.logger.debug(`uploaded - result:${JSON.stringify(result)}`);
            const s3Location = result.Location;
            const cdnLocation = "";
            return {
                location: cdnLocation || s3Location,
            };
        }
        catch (e) {
            throw new file_upload_exceptions_1.FileUploadException(e);
        }
    }
    async uploadS3(file, bucket, name) {
        const s3 = this.getS3();
        const params = {
            Bucket: bucket,
            Key: String(name),
            Body: file,
        };
        return new Promise((resolve, reject) => {
            s3.upload(params, (err, data) => {
                if (err) {
                    this.logger.error(err);
                    reject(err.message);
                }
                resolve(data);
            });
        });
    }
    getS3() {
        return new aws_sdk_1.S3({
            accessKeyId: this.configService.get("AWS_ACCESS_KEY_ID"),
            secretAccessKey: this.configService.get("AWS_SECRET_ACCESS_KEY"),
        });
    }
};
FileUploadService = FileUploadService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FileUploadService);
exports.FileUploadService = FileUploadService;
//# sourceMappingURL=file-upload.service.js.map