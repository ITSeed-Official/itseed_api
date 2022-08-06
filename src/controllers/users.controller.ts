import {
  Controller,
  Get,
  Body,
  Patch,
  UseInterceptors,
  ClassSerializerInterceptor,
} from "@nestjs/common";
import {
  UsersService,
  UpdateUserDto,
  Auth,
  User,
  UserEntity,
} from "../modules";
import { ApiTags, ApiBody } from "@nestjs/swagger";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Auth()
  @Get("me")
  async findMe(@User() user: UserEntity) {
    return this.usersService.findOne(user.id);
  }

  @Auth()
  @ApiBody({ type: UpdateUserDto })
  @Patch("me")
  async update(@User("id") userId: number, @Body() dto: UpdateUserDto) {
    await this.usersService.updateInfo(userId, dto);
    return "success";
  }
}
