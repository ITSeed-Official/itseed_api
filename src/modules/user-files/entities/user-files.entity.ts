import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("user_files")
export class UserFileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  type: string;

  @Column()
  path: string;

  @Column()
  name: string;
}
