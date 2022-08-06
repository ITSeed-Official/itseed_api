import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity, GoogleUserEntity } from "./entities";
import { UpdateUserDto } from "./dto";
import * as bcrypt from "bcryptjs";
import { isNil } from "lodash";
import { TransformedGoogleUser } from "../../common/dtos";

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(GoogleUserEntity)
    private readonly googleUserRepository: Repository<GoogleUserEntity>
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(
      Number(process.env.AUTH_SALT_ROUNDS) || 10
    );
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash;
  }

  async updateInfo(id: number, dto: UpdateUserDto) {
    this.logger.debug(`User updated: ${id}`);
    return this.usersRepository.update(id, dto);
  }

  async updatePassword(id: number, password: string) {
    const passwordHash = await this.hashPassword(password);
    this.logger.debug(`User update password: userId: ${id}`);
    return this.usersRepository.update(id, { passwordHash });
  }

  async updateVerifyCode(id: number, code: string) {
    const result = await this.usersRepository.update(
      {
        id,
        isVerified: false,
      },
      {
        verifiedCode: code,
        lastVerifiedEmailAt: new Date(),
      }
    );
    return result.affected === 1;
  }

  async updateResetPasswordCode(id: number, code: string) {
    const result = await this.usersRepository.update(
      {
        id,
      },
      {
        resetPasswordCode: code,
        lastResetPasswordEmailAt: new Date(),
      }
    );
    return result.affected === 1;
  }

  async updateVerifyStatus(id: number, code: string) {
    const result = await this.usersRepository.update(
      {
        id,
        verifiedCode: code,
        isVerified: false,
      },
      {
        isVerified: true,
        verifiedAt: new Date(),
      }
    );
    return result.affected === 1;
  }

  async findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    return this.usersRepository.findOne(id);
  }

  async findGoogleUserOne(googleId: string): Promise<GoogleUserEntity> {
    return this.googleUserRepository.findOne({
      where: {
        googleId,
      },
      relations: ["user"],
    });
  }

  async getOrCreateUserFromGoogle(
    rawUser: TransformedGoogleUser
  ): Promise<UserEntity> {
    let user = await this.findOneByUsername(rawUser.email);
    console.log(rawUser);
    if (isNil(user)) {
      user = this.usersRepository.create({
        username: rawUser.email,
        nickname: rawUser.givenName,
        passwordHash: "",
        isVerified: rawUser.emailVerified,
        avatar: rawUser.avatar,
      });
      user = await this.usersRepository.save(user);
    }
    let googleUser = await this.findGoogleUserOne(rawUser.id);
    if (isNil(googleUser)) {
      googleUser = this.googleUserRepository.create({
        googleId: rawUser.id,
        email: rawUser.email,
        emailVerified: rawUser.emailVerified,
        displayName: rawUser.displayName,
        familyName: rawUser.familyName,
        givenName: rawUser.givenName,
        avatar: rawUser.avatar,
        accessToken: rawUser.accessToken,
        user,
      });
      await this.googleUserRepository.save(googleUser);
    }
    return user;
  }

  async findByIds(ids: number[]): Promise<UserEntity[]> {
    return this.usersRepository.find({
      where: {
        id: ids,
      },
    });
  }

  async findOneByUsername(username: string): Promise<UserEntity> {
    return this.usersRepository.findOne({ username });
  }
}
