import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("user_interview_answers")
export class UserInterviewAnswerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  number: number;

  @Column()
  answer: string;
}
