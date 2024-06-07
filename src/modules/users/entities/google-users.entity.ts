import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  Index,
  JoinColumn,
} from "typeorm";
import { UserEntity } from "./users.entity";
import { ResponseGoogleUserDto } from "../dto";

@Index("googleId", ["googleId"], { unique: true })
@Entity("google_users")
export class GoogleUserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  googleId: string;

  @Column({ unique: true })
  email: string;

  @Column()
  emailVerified: boolean;

  @Column()
  displayName: string;

  @Column()
  familyName: string;

  @Column()
  givenName: string;

  @Column({ type: "text" })
  avatar: string;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: "userId" })
  user: UserEntity;

  @Column()
  userId: number;

  @Column()
  accessToken: string;

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

  getResponse(): ResponseGoogleUserDto {
    return {
      id: this.id,
      googleId: this.googleId,
      email: this.email,
      emailVerified: this.emailVerified,
      displayName: this.displayName,
      familyName: this.familyName,
      givenName: this.givenName,
      avatar: this.avatar,
      user: this.user ? this.user.getResponse() : null,
    };
  }
}
