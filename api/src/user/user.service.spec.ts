import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { Connection } from 'mongoose';

describe('UserService', () => {
  let service: UserService;

  const mockConnection = {
    model: jest.fn().mockReturnValue({
      new: jest.fn(),
      constructor: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      findOne: jest.fn(),
      exec: jest.fn(),
      save: jest.fn(),
      updateOne: jest.fn(),
      deleteOne: jest.fn(),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getConnectionToken(),
          useValue: mockConnection,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
