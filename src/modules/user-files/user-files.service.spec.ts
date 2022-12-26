import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserFileEntity } from "./entities/user-files.entity";
import { UserFilesService } from "./user-files.service";

describe("UserFilesService", () => {
  let service: UserFilesService;

  const mockUserFileRepo = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserFilesService,
        {
          provide: getRepositoryToken(UserFileEntity),
          useValue: mockUserFileRepo,
        },
      ],
    }).compile();

    service = module.get<UserFilesService>(UserFilesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("when the user does not upload the files", () => {
    it("should get the UserFiles with empty string", async () => {
      const userId = 1;
      jest
        .spyOn(mockUserFileRepo, "find")
        .mockImplementation((): UserFileEntity[] => {
          return [];
        });
      const userFiles = await service.getUserFiles(userId);
      expect(userFiles).toEqual({});
    });
  });

  describe("when the user has already uploaded the files", () => {
    it("should get the UserFiles", async () => {
      const userId = 1;
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
          path: "resume file path",
          name: "resume file name",
        },
        certification: {
          path: "certification file path",
          name: "certification file name",
        },
      });
    });
  });
});
