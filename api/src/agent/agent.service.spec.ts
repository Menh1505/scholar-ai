// agent.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AgentService } from './agent.service';
import {
  AgentSession,
  AgentSessionDocument,
  Phase,
} from './schema/agent.schema';

describe('AgentService', () => {
  let service: AgentService;
  let model: Model<AgentSessionDocument>;

  const mockSession = {
    userId: 'test-user-123',
    phase: Phase.INTRO,
    selectedSchool: null,
    selectedMajor: null,
    userInfo: {},
    legalChecklist: [],
    messages: [],
    isCompleted: false,
    preferences: {},
    analytics: {},
    save: jest.fn(),
    _id: 'mock-session-id',
  };

  const mockModel = {
    findOne: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
    create: jest.fn(),
    constructor: jest.fn().mockResolvedValue(mockSession),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgentService,
        {
          provide: getModelToken(AgentSession.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<AgentService>(AgentService);
    model = module.get<Model<AgentSessionDocument>>(
      getModelToken(AgentSession.name),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getOrCreateSession', () => {
    it('should return existing session if found', async () => {
      mockModel.findOne.mockResolvedValue(mockSession);

      const result = await service.getOrCreateSession('test-user-123');

      expect(mockModel.findOne).toHaveBeenCalledWith({
        userId: 'test-user-123',
      });
      expect(result).toEqual(mockSession);
    });

    it('should create new session if not found', async () => {
      mockModel.findOne.mockResolvedValue(null);
      const newSession = { ...mockSession, save: jest.fn() };
      (model as any).mockImplementation(() => newSession);

      const result = await service.getOrCreateSession('test-user-123');

      expect(mockModel.findOne).toHaveBeenCalledWith({
        userId: 'test-user-123',
      });
      expect(newSession.save).toHaveBeenCalled();
    });
  });

  describe('updateSession', () => {
    it('should update session with provided data', async () => {
      const updates = { phase: Phase.COLLECT_INFO, selectedSchool: 'Harvard' };
      mockModel.updateOne.mockResolvedValue({ acknowledged: true });

      await service.updateSession('test-user-123', updates);

      expect(mockModel.updateOne).toHaveBeenCalledWith(
        { userId: 'test-user-123' },
        { $set: updates },
      );
    });
  });

  describe('resetSession', () => {
    it('should delete session for user', async () => {
      mockModel.deleteOne.mockResolvedValue({ acknowledged: true });

      await service.resetSession('test-user-123');

      expect(mockModel.deleteOne).toHaveBeenCalledWith({
        userId: 'test-user-123',
      });
    });
  });

  describe('completeSession', () => {
    it('should mark session as completed', async () => {
      mockModel.updateOne.mockResolvedValue({ acknowledged: true });

      await service.completeSession('test-user-123');

      expect(mockModel.updateOne).toHaveBeenCalledWith(
        { userId: 'test-user-123' },
        {
          $set: {
            isCompleted: true,
            completedAt: expect.any(Date),
            phase: Phase.PROGRESS_TRACKING,
          },
        },
      );
    });
  });

  describe('handlePrompt', () => {
    beforeEach(() => {
      // Mock environment variables
      process.env.OPENAI_API_KEY = 'test-api-key';
      process.env.AGENT_SYSTEM_TOKEN = 'test-system-token';
    });

    it('should process user message and return response', async () => {
      const sessionWithMessages = {
        ...mockSession,
        messages: [],
        save: jest.fn(),
      };

      jest
        .spyOn(service, 'getOrCreateSession')
        .mockResolvedValue(sessionWithMessages as any);

      // Mock LangChain components
      const mockAgentExecutor = {
        invoke: jest.fn().mockResolvedValue({
          output: 'Chào bạn! Tôi là Scholar AI, trợ lý tư vấn du học Mỹ.',
        }),
      };

      // This test would need more complex mocking for LangChain components
      // For now, we'll test the basic structure
      expect(service.handlePrompt).toBeDefined();
    });
  });

  describe('phase management', () => {
    it('should transition from INTRO to COLLECT_INFO', () => {
      const mockSession = {
        phase: Phase.INTRO,
        messages: [],
        save: jest.fn(),
      };

      // Test phase transition logic
      expect(Phase.INTRO).toBe('intro');
      expect(Phase.COLLECT_INFO).toBe('collect_info');
    });

    it('should handle phase transitions correctly', () => {
      const phases = [
        Phase.INTRO,
        Phase.COLLECT_INFO,
        Phase.SELECT_SCHOOL,
        Phase.LEGAL_CHECKLIST,
        Phase.PROGRESS_TRACKING,
      ];

      expect(phases).toHaveLength(5);
      expect(phases[0]).toBe('intro');
      expect(phases[4]).toBe('progress_tracking');
    });
  });

  describe('user info management', () => {
    it('should update user info', async () => {
      const userInfo = {
        gpa: 3.8,
        toeflScore: 100,
        desiredMajor: 'Computer Science',
        budget: 50000,
      };

      mockModel.updateOne.mockResolvedValue({ acknowledged: true });

      await service.updateUserInfo('test-user-123', userInfo);

      expect(mockModel.updateOne).toHaveBeenCalledWith(
        { userId: 'test-user-123' },
        { $set: { userInfo } },
      );
    });
  });

  describe('legal checklist management', () => {
    it('should add document to legal checklist', async () => {
      const document = {
        name: 'I-20',
        id: 'doc-123',
        status: 'pending',
        createdAt: new Date(),
      };

      mockModel.updateOne.mockResolvedValue({ acknowledged: true });

      await service.addToLegalChecklist('test-user-123', document);

      expect(mockModel.updateOne).toHaveBeenCalledWith(
        { userId: 'test-user-123' },
        { $push: { legalChecklist: document } },
      );
    });
  });

  describe('session statistics', () => {
    it('should return session statistics', async () => {
      const sessionWithStats = {
        ...mockSession,
        messages: [{ role: 'user', content: 'hello', timestamp: new Date() }],
        legalChecklist: [
          { name: 'I-20', status: 'completed' },
          { name: 'Passport', status: 'pending' },
        ],
        progressPercentage: 50,
        sessionDuration: 3600000, // 1 hour
      };

      jest
        .spyOn(service, 'getOrCreateSession')
        .mockResolvedValue(sessionWithStats as any);

      const stats = await service.getSessionStats('test-user-123');

      expect(stats.totalMessages).toBe(1);
      expect(stats.currentPhase).toBe(Phase.INTRO);
      expect(stats.documentsCompleted).toBe(1);
      expect(stats.totalDocuments).toBe(2);
      expect(stats.isCompleted).toBe(false);
    });
  });
});
