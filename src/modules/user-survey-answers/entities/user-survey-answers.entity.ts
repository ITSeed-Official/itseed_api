import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("user_survey_answers")
export class UserSurveyAnswerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  number: number;

  @Column()
  answerNumber: number;
}
