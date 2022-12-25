import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserInterviewAnswersService } from "./user-interview-answers.service";
import { UserInterviewAnswerEntity } from "./entities/user-interview-answers.entity";

describe("UserInterviewAnswersService", () => {
  let service: UserInterviewAnswersService;

  const mockInterviewRepo = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserInterviewAnswersService,
        {
          provide: getRepositoryToken(UserInterviewAnswerEntity),
          useValue: mockInterviewRepo,
        },
      ],
    }).compile();

    service = module.get<UserInterviewAnswersService>(
      UserInterviewAnswersService
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("when the user has not filled in the information", () => {
    it("should get interview questions but it does not have answers", async () => {
      jest.spyOn(mockInterviewRepo, "find").mockImplementation(() => {
        return [];
      });

      const interviews = await service.getUserInterview(1);

      interviews.forEach((interviewQuestion) => {
        expect(interviewQuestion.answer).toBe("");
      });
    });
  });

  describe("when the user has filled in the information", () => {
    it("should get interview questions and their answers", async () => {
      const userId = 1;
      const questionNumber = 1;
      const answerDescription = "my answer";

      jest.spyOn(mockInterviewRepo, "find").mockImplementation(() => {
        return [
          generateAnswerDescription(userId, questionNumber, answerDescription),
        ];
      });

      const interviews = await service.getUserInterview(userId);

      const question = interviews.find((question) => {
        return question.number === questionNumber;
      });

      expect(question.answer).toBe(answerDescription);
    });
  });
});

const generateAnswerDescription = (
  userId: number,
  number: number,
  answerDescription: string
): UserInterviewAnswerEntity => {
  const answer = new UserInterviewAnswerEntity();
  answer.userId = userId;
  answer.number = number;
  answer.answer = answerDescription;

  return answer;
};
