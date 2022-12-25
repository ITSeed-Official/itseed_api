import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("user_files")
export class UserFileEntity {
  @PrimaryColumn({ name: "userId" })
  userId: number;

  @PrimaryColumn({ name: "type" })
  type: string;

  @Column()
  path: string;

  @Column()
  name: string;
}
