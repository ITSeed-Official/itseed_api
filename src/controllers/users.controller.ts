import {
  Controller,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
} from "@nestjs/common";
import { UsersService, Auth, User, UserEntity } from "../modules";
import { ApiTags } from "@nestjs/swagger";

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
}
