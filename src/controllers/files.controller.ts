import {
  Body,
  Controller,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { Response } from "express";
import { ApiHeader, ApiTags } from "@nestjs/swagger";
import { User, UserEntity, Auth, FileUploadService } from "src/modules";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateFilePayload } from "src/modules/file-upload/dtos/create-file-payload.dto";

@ApiTags("files")
@Controller("files")
export class FilesController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Auth()
  @ApiHeader({
    name: "Cookie",
    description: "Try to set cookie.",
  })
  @UseInterceptors(FileInterceptor("file"))
  @Post()
  async create(
    @User() user: UserEntity,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateFilePayload,
    @Res() response: Response
  ) {
    try {
      const result = await this.fileUploadService.execute(file, user.id, dto);

      response.json({
        data: {
          path: result.filePath,
          name: dto.name,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
