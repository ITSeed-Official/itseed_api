import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("user_interview_answers")
export class UserInterviewAnswerEntity {
  @PrimaryColumn({ name: "userId" })
  userId: number;

  @PrimaryColumn({ name: "number" })
  number: number;

  @Column()
  answer: string;
}
