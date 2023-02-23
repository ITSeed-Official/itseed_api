import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserFileEntity } from "./entities/user-files.entity";
import { UserFilesService } from "./user-files.service";
import { UserFiles as UserFilesDto } from "../applications/dtos/update-application-payload.dto";

describe("UserFilesService", () => {
  let service: UserFilesService;
  const awsUrl = "AWS_CLOUDFRONT";
  const userId = 1;

  const userFilesIsCompleteTestCase = [
    {
      expected: false,
      files: [
        {
          userId: 1,
          type: "certification",
          path: "certification file path",
          name: "certification file name",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
    {
      expected: false,
      files: [
        {
          userId: 1,
          type: "resume",
          path: "resume file path",
          name: "resume file name",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
    {
      expected: true,
      files: [
        {
          userId: 1,
          type: "resume",
          path: "resume file path",
          name: "resume file name",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 1,
          type: "certification",
          path: "certification file path",
          name: "certification file name",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
  ];

  const mockUserFileRepo = {
    find: jest.fn(),
    upsert: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserFilesService,
        {
          provide: getRepositoryToken(UserFileEntity),
          useValue: mockUserFileRepo,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === awsUrl) {
                return awsUrl;
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<UserFilesService>(UserFilesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("#getUserFiles", () => {
    describe("when the user does not upload the files", () => {
      it("should get the UserFiles with empty string", async () => {
        jest
          .spyOn(mockUserFileRepo, "find")
          .mockImplementation((): UserFileEntity[] => {
            return [];
          });
        const userFiles = await service.getUserFiles(userId);
        expect(userFiles).toEqual({
          resume: {
            name: null,
            path: null,
          },
          certification: {
            name: null,
            path: null,
          },
        });
      });
    });

    describe("when the user has already uploaded the files", () => {
      it("should get the UserFiles", async () => {
        jest
          .spyOn(mockUserFileRepo, "find")
          .mockImplementation((): UserFileEntity[] => {
            return [
              {
                userId: 1,
                type: "resume",
                path: "resume file path",
                name: "resume file name",
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              {
                userId: 1,
                type: "certification",
                path: "certification file path",
                name: "certification file name",
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ];
          });
        const userFiles = await service.getUserFiles(userId);
        expect(userFiles).toEqual({
          resume: {
            path: `${awsUrl}resume file path`,
            name: "resume file name",
          },
          certification: {
            path: `${awsUrl}certification file path`,
            name: "certification file name",
          },
        });
      });
    });
  });

  describe("#updateByUserId", () => {
    const userFilesDto: UserFilesDto = {
      resume: {
        path: "resume path",
        name: "resume name",
      },
      certification: {
        path: "certification path",
        name: "certification name",
      },
    };

    describe("update user files", () => {
      it("should update user files successfully", async () => {
        jest
          .spyOn(mockUserFileRepo, "upsert")
          .mockImplementation((updateData, options) => {
            expect(updateData).toEqual([
              {
                type: "resume",
                userId: userId,
                name: "resume name",
                path: "resume path",
              },
              {
                type: "certification",
                userId: userId,
                name: "certification name",
                path: "certification path",
              },
            ]);

            expect(options).toEqual({
              conflictPaths: ["userId", "type"],
              skipUpdateIfNoValuesChanged: true,
            });
          });

        await service.updateByUserId(userId, userFilesDto);
      });
    });

    describe("repository update data failed", () => {
      it("should throw exception", async () => {
        jest.spyOn(mockUserFileRepo, "upsert").mockImplementation(() => {
          throw new Error("update data failed");
        });

        try {
          await service.updateByUserId(userId, userFilesDto);
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toBe("update data failed");
        }
      });
    });
  });

  describe("#isComplete", () => {
    describe("when resume is not uploaded", () => {
      userFilesIsCompleteTestCase.forEach((testCase) => {
        it("should return false", async () => {
          jest
            .spyOn(mockUserFileRepo, "find")
            .mockImplementation((): UserFileEntity[] => {
              return testCase.files;
            });

          const result = await service.isComplete(userId);
          expect(result).toBe(testCase.expected);
        });
      });
    });
  });
});
