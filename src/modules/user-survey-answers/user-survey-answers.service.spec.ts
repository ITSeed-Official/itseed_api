import { Test, TestingModule } from "@nestjs/testing";
import { UserSurveyAnswersService } from "./user-survey-answers.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserSurveyAnswerEntity } from "./entities/user-survey-answers.entity";
import { SurveyAnswer } from "../applications/dtos/update-application-payload.dto";
import { surveyQuestions } from "./consts/const";
import { SurveyResult } from "./enums";

describe("UserSurveyAnswersService", () => {
  let service: UserSurveyAnswersService;
  const userId = 1;

  const mockSurveyRepo = {
    find: jest.fn(),
    upsert: jest.fn(),
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

  describe("#getUserSurvey", () => {
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

  describe("#updateByUserId", () => {
    const dto: SurveyAnswer[] = [
      {
        number: 1,
        answerNumber: 3,
      },
    ];

    it("should update survey answer by user ID and question number", async () => {
      jest
        .spyOn(mockSurveyRepo, "upsert")
        .mockImplementation((updateData, options) => {
          expect(updateData).toEqual([
            {
              userId: userId,
              number: 1,
              answerNumber: 3,
            },
          ]);
          expect(options).toEqual({
            conflictPaths: ["userId", "number"],
            skipUpdateIfNoValuesChanged: true,
          });
        });

      await service.updateByUserId(userId, dto);
    });

    it("should throw exception when repo went wrong", async () => {
      jest.spyOn(mockSurveyRepo, "upsert").mockImplementation(() => {
        throw new Error("test error");
      });

      try {
        await service.updateByUserId(userId, dto);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe("test error");
      }
    });
  });

  describe("#isComplete", () => {
    describe("when all questions have answers", () => {
      it("should return true", async () => {
        const answers = surveyQuestions.map((question) => {
          return generateAnswer(userId, question.number, 1);
        });

        jest.spyOn(mockSurveyRepo, "find").mockImplementation(() => {
          return answers;
        });

        const result = await service.isComplete(userId);
        expect(result).toBe(true);
      });
    });

    describe("when some questions do not have answers", () => {
      it("should return false", async () => {
        const answers = [generateAnswer(userId, 1, 1)];

        jest.spyOn(mockSurveyRepo, "find").mockImplementation(() => {
          return answers;
        });

        const result = await service.isComplete(userId);
        expect(result).toBe(false);
      });
    });
  });

  describe("#getSurveyResult", () => {
    describe("when the option 1 answered most times", () => {
      it("should return result D", async () => {
        const answers = [
          generateAnswer(userId, 1, 1),
          generateAnswer(userId, 2, 1),
          generateAnswer(userId, 3, 2),
        ];

        jest.spyOn(mockSurveyRepo, "find").mockImplementation(() => {
          return answers;
        });

        const result = await service.getSurveyResult(userId);
        expect(result).toBe(SurveyResult.D);
      });
    });

    describe("when the option 2 answered most times", () => {
      it("should return result I", async () => {
        const answers = [
          generateAnswer(userId, 1, 2),
          generateAnswer(userId, 2, 2),
          generateAnswer(userId, 3, 3),
        ];

        jest.spyOn(mockSurveyRepo, "find").mockImplementation(() => {
          return answers;
        });

        const result = await service.getSurveyResult(userId);
        expect(result).toBe(SurveyResult.I);
      });
    });

    describe("when the option 3 answered most times", () => {
      it("should return result S", async () => {
        const answers = [
          generateAnswer(userId, 1, 3),
          generateAnswer(userId, 2, 3),
          generateAnswer(userId, 3, 1),
        ];

        jest.spyOn(mockSurveyRepo, "find").mockImplementation(() => {
          return answers;
        });

        const result = await service.getSurveyResult(userId);
        expect(result).toBe(SurveyResult.S);
      });
    });

    describe("when the option 4 answered most times", () => {
      it("should return result D", async () => {
        const answers = [
          generateAnswer(userId, 1, 4),
          generateAnswer(userId, 2, 4),
          generateAnswer(userId, 3, 1),
        ];

        jest.spyOn(mockSurveyRepo, "find").mockImplementation(() => {
          return answers;
        });

        const result = await service.getSurveyResult(userId);
        expect(result).toBe(SurveyResult.C);
      });
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
