import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { LegalService } from './legal.service';

describe('LegalService', () => {
  let service: LegalService;

  const mockLegalModel = {
    new: jest.fn(),
    constructor: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    exec: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LegalService,
        {
          provide: getModelToken('Legal'),
          useValue: mockLegalModel,
        },
      ],
    }).compile();

    service = module.get<LegalService>(LegalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
