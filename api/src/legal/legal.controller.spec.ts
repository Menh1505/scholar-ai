import { Test, TestingModule } from '@nestjs/testing';
import { LegalController } from './legal.controller';
import { LegalService } from './legal.service';

describe('LegalController', () => {
  let controller: LegalController;

  const mockLegalService = {
    create: jest.fn(),
    findOne: jest.fn(),
    findByUserId: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LegalController],
      providers: [
        {
          provide: LegalService,
          useValue: mockLegalService,
        },
      ],
    }).compile();

    controller = module.get<LegalController>(LegalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
