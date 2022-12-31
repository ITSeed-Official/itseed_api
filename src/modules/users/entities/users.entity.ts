import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Exclude } from "class-transformer";
import { Gender } from "../enum";
import { ResponseUserDto } from "../dto";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  passwordHash: string;

  @Column()
  nickname: string;

  @Column({ length: 10, type: "varchar", nullable: true })
  gender: Gender;

  @Column({ length: 32, type: "varchar", nullable: true })
  city: string;

  @Column()
  avatar: string;

  @Column({ length: 10, type: "varchar", nullable: true })
  phone: string;

  @Column({ length: 10, type: "varchar", nullable: true })
  school: string;

  @Column({ length: 10, type: "varchar", nullable: true })
  department: string;

  @Column({ nullable: true })
  grade: number;

  @Column({ length: 10, type: "varchar", nullable: true })
  recommender: string;

  @Column({ type: "varchar", nullable: true })
  referer: string;

  @Column({ type: "smallint", default: 0 })
  step: number;

  @Exclude()
  @Column({ default: false })
  isVerified: boolean;

  @Exclude()
  @Column({ nullable: true })
  verifiedCode: string;

  @Exclude()
  @Column({ type: "timestamp", nullable: true })
  verifiedAt: Date;

  @Exclude()
  @Column({ type: "timestamp", nullable: true })
  lastVerifiedEmailAt: Date;

  @Exclude()
  @Column({ nullable: true })
  resetPasswordCode: string;

  @Exclude()
  @Column({ type: "timestamp", nullable: true })
  lastResetPasswordEmailAt: Date;

  @Exclude()
  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  public updatedAt: Date;

  getResponse(): ResponseUserDto {
    return {
      id: this.id,
      email: this.email,
      nickname: this.nickname,
      gender: this.gender,
      city: this.city,
      avatar: this.avatar ? this.avatar : null,
      phone: this.phone,
      school: this.school,
      department: this.department,
      grade: this.grade,
      recommender: this.recommender,
      referer: this.referer ? this.referer.split(",") : [],
      step: this.step,
    };
  }
}
