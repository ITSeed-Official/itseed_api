import { Test, TestingModule } from "@nestjs/testing";
import { UserSurveyAnswersService } from "./user-survey-answers.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserSurveyAnswerEntity } from "./entities/user-survey-answers.entity";

describe("UserSurveyAnswersService", () => {
  let service: UserSurveyAnswersService;

  const mockSurveyRepo = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserSurveyAnswersService,
        {
          provide: getRepositoryToken(UserSurveyAnswerEntity),
          useValue: mockSurveyRepo,
        },
      ],
    }).compile();

    service = module.get<UserSurveyAnswersService>(UserSurveyAnswersService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("when the user has not filled in the information", () => {
    it("should get questions but it does not have answers", async () => {
      jest.spyOn(mockSurveyRepo, "find").mockImplementation(() => {
        return [];
      });

      const surveys = await service.getUserSurvey(1);

      surveys.forEach((question) => {
        expect(question.answer).toBe(null);
      });
    });
  });

  describe("when the user has filled in the information", () => {
    it("should get questions and their answers", async () => {
      const userId = 1;
      const questionNumber = 1;
      const answerNumber = 1;

      jest.spyOn(mockSurveyRepo, "find").mockImplementation(() => {
        return [generateAnswer(userId, questionNumber, answerNumber)];
      });

      const surveys = await service.getUserSurvey(userId);

      const question = surveys.find((question) => {
        return question.number === questionNumber;
      });

      expect(question.answer).toBe(answerNumber);
    });
  });
});

const generateAnswer = (
  userId: number,
  number: number,
  answerNumber: number
): UserSurveyAnswerEntity => {
  const answer = new UserSurveyAnswerEntity();
  answer.userId = userId;
  answer.number = number;
  answer.answerNumber = answerNumber;

  return answer;
};
