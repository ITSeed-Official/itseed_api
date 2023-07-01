import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity, GoogleUserEntity } from "./entities";
import * as bcrypt from "bcryptjs";
import { isNil } from "lodash";
import { TransformedGoogleUser } from "../../common/dtos";
import { UserInformation } from "../applications/dtos/update-application-payload.dto";
import {
  REGISTRATION,
  USER_FILE_COMPLETION,
  USER_INFO_COMPLETION,
  USER_INTERVIEW_COMPLETION,
  USER_SURVEY_COMPLETION,
} from "./consts/const";

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

  async update(id: number, dto: UserInformation) {
    const updateData = {
      ...dto,
      grade: dto.grade.find((option) => option.selected).value,
      referer: dto.referer
        .filter((option) => option.selected)
        .map((option) => option.value)
        .join(","),
    };

    try {
      await this.usersRepository.update(id, updateData);
    } catch (error) {
      throw error;
    }
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

  async findByStep(step: number): Promise<UserEntity[]> {
    return this.usersRepository.find({
      where: {
        step,
      },
    });
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
    console.log("getOrCreateUserFromGoogle", rawUser);
    const {
      id,
      displayName,
      email,
      familyName,
      givenName,
      emailVerified,
      avatar,
      accessToken,
    } = rawUser;
    let user = await this.findOneByEmail(email);

    const transFamilyName = isNil(familyName) ? "" : familyName;

    if (isNil(user)) {
      user = this.usersRepository.create({
        email: email,
        nickname: `${transFamilyName}${givenName}`,
        passwordHash: "",
        isVerified: emailVerified,
        avatar: avatar,
      });
      user = await this.usersRepository.save(user);
    }
    let googleUser = await this.findGoogleUserOne(id);
    if (isNil(googleUser)) {
      googleUser = this.googleUserRepository.create({
        googleId: id,
        email: email,
        emailVerified: emailVerified,
        displayName: displayName,
        familyName: transFamilyName,
        givenName: givenName,
        avatar: avatar,
        accessToken: accessToken,
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

  async findOneByEmail(email: string): Promise<UserEntity> {
    return this.usersRepository.findOne({ email });
  }

  async calculateSteps(id: number, targetStep: number) {
    await this.usersRepository.update(id, { step: targetStep });
  }

  async isComplete(id: number): Promise<boolean> {
    const user = await this.usersRepository.findOne(id);

    if (isNil(user.nickname)) {
      return false;
    }

    if (isNil(user.gender)) {
      return false;
    }

    if (isNil(user.school)) {
      return false;
    }

    if (isNil(user.department)) {
      return false;
    }

    if (isNil(user.grade)) {
      return false;
    }

    if (isNil(user.phone) || user.phone.length !== 10) {
      return false;
    }

    return true;
  }

  async getStepCount(): Promise<Record<number, number>> {
    const result = await this.usersRepository
      .createQueryBuilder("user")
      .select("user.step, COUNT(*) as count")
      .groupBy("user.step")
      .getRawMany();

    const stepMapping = result.reduce((acc, curr) => {
      acc[curr.step] = parseInt(curr.count) || 0;
      return acc;
    }, {});

    return [
      REGISTRATION,
      USER_SURVEY_COMPLETION,
      USER_INFO_COMPLETION,
      USER_INTERVIEW_COMPLETION,
      USER_FILE_COMPLETION,
    ].reduce((acc, curr) => {
      acc[curr] = stepMapping[curr] || 0;
      return acc;
    }, {});
  }
}
