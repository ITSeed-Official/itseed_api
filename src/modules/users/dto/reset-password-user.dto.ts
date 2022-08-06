import { CreateUserDto } from './create-user.dto';
import { PickType } from '@nestjs/swagger';

export class ResetPasswordUserDto extends PickType(CreateUserDto, [
  'password',
] as const) {}
