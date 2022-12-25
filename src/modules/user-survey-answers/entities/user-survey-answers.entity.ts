import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("user_survey_answers")
export class UserSurveyAnswerEntity {
  @PrimaryColumn({ name: "userId" })
  userId: number;

  @PrimaryColumn({ name: "number" })
  number: number;

  @Column()
  answerNumber: number;
}
