// agent.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, HttpException } from '@nestjs/common';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import { Phase } from './schema/agent.schema';

describe('AgentController', () => {
  let controller: AgentController;
  let service: AgentService;

  const mockAgentService = {
    handlePrompt: jest.fn(),
    getOrCreateSession: jest.fn(),
    resetSession: jest.fn(),
    completeSession: jest.fn(),
    getSessionStats: jest.fn(),
  };

  const mockSession = {
    _id: 'mock-session-id',
    userId: 'test-user-123',
    phase: Phase.INTRO,
    selectedSchool: null,
    selectedMajor: null,
    userInfo: {},
    legalChecklist: [],
    messages: [],
    isCompleted: false,
    progressPercentage: 0,
    analytics: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgentController],
      providers: [
        {
          provide: AgentService,
          useValue: mockAgentService,
        },
      ],
    }).compile();

    controller = module.get<AgentController>(AgentController);
    service = module.get<AgentService>(AgentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleMessage', () => {
    const mockRequest = {
      headers: {
        authorization: 'Bearer test-token',
      },
    };

    it('should handle valid message successfully', async () => {
      const messageBody = {
        userId: 'test-user-123',
        message: 'Xin chào, tôi muốn tư vấn du học Mỹ',
      };

      mockAgentService.handlePrompt.mockResolvedValue(
        'Chào bạn! Tôi là Scholar AI, trợ lý tư vấn du học Mỹ.',
      );
      mockAgentService.getOrCreateSession.mockResolvedValue(mockSession);

      const result = await controller.handleMessage(messageBody, mockRequest);

      expect(mockAgentService.handlePrompt).toHaveBeenCalledWith(
        'test-user-123',
        'Xin chào, tôi muốn tư vấn du học Mỹ',
        'Bearer test-token',
      );
      expect(result).toEqual({
        response: 'Chào bạn! Tôi là Scholar AI, trợ lý tư vấn du học Mỹ.',
        phase: Phase.INTRO,
        sessionId: 'mock-session-id',
        timestamp: expect.any(Date),
      });
    });

    it('should throw BadRequestException for missing userId', async () => {
      const messageBody = {
        message: 'Hello',
      };

      await expect(
        controller.handleMessage(messageBody as any, mockRequest),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for missing message', async () => {
      const messageBody = {
        userId: 'test-user-123',
      };

      await expect(
        controller.handleMessage(messageBody as any, mockRequest),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for empty message', async () => {
      const messageBody = {
        userId: 'test-user-123',
        message: '   ',
      };

      await expect(
        controller.handleMessage(messageBody, mockRequest),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for message too long', async () => {
      const messageBody = {
        userId: 'test-user-123',
        message: 'a'.repeat(1001),
      };

      await expect(
        controller.handleMessage(messageBody, mockRequest),
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle service errors', async () => {
      const messageBody = {
        userId: 'test-user-123',
        message: 'Hello',
      };

      mockAgentService.handlePrompt.mockRejectedValue(
        new Error('Service error'),
      );

      await expect(
        controller.handleMessage(messageBody, mockRequest),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('getSession', () => {
    it('should return session data successfully', async () => {
      mockAgentService.getOrCreateSession.mockResolvedValue(mockSession);

      const result = await controller.getSession('test-user-123');

      expect(mockAgentService.getOrCreateSession).toHaveBeenCalledWith(
        'test-user-123',
      );
      expect(result).toEqual({
        sessionId: 'mock-session-id',
        userId: 'test-user-123',
        phase: Phase.INTRO,
        selectedSchool: null,
        selectedMajor: null,
        legalChecklist: [],
        userInfo: {},
        isCompleted: false,
        progressPercentage: 0,
        analytics: {},
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should throw BadRequestException for missing userId', async () => {
      await expect(controller.getSession('')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getMessageHistory', () => {
    it('should return message history', async () => {
      const sessionWithMessages = {
        ...mockSession,
        messages: [
          { role: 'user', content: 'Hello', timestamp: new Date() },
          { role: 'agent', content: 'Hi there!', timestamp: new Date() },
        ],
      };

      mockAgentService.getOrCreateSession.mockResolvedValue(
        sessionWithMessages,
      );

      const mockRequest = {
        query: { limit: '10', offset: '0' },
      };

      const result = await controller.getMessageHistory(
        'test-user-123',
        mockRequest,
      );

      expect(result).toEqual({
        messages: expect.any(Array),
        total: 2,
        limit: 10,
        offset: 0,
        hasMore: false,
      });
    });
  });

  describe('resetSession', () => {
    it('should reset session successfully', async () => {
      mockAgentService.resetSession.mockResolvedValue(undefined);

      const result = await controller.resetSession('test-user-123');

      expect(mockAgentService.resetSession).toHaveBeenCalledWith(
        'test-user-123',
      );
      expect(result).toEqual({
        message: 'Session đã được reset thành công',
        userId: 'test-user-123',
        timestamp: expect.any(Date),
      });
    });

    it('should throw BadRequestException for missing userId', async () => {
      await expect(controller.resetSession('')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('completeSession', () => {
    it('should complete session successfully', async () => {
      mockAgentService.completeSession.mockResolvedValue(undefined);

      const result = await controller.completeSession('test-user-123');

      expect(mockAgentService.completeSession).toHaveBeenCalledWith(
        'test-user-123',
      );
      expect(result).toEqual({
        message: 'Session đã hoàn thành thành công',
        userId: 'test-user-123',
        timestamp: expect.any(Date),
      });
    });
  });

  describe('healthCheck', () => {
    it('should return health status', async () => {
      const result = await controller.healthCheck();

      expect(result).toEqual({
        status: 'healthy',
        timestamp: expect.any(Date),
        service: 'agent',
        version: '1.0.0',
      });
    });
  });

  describe('end-to-end conversation flow', () => {
    it('should handle complete conversation flow', async () => {
      // Test intro phase
      mockAgentService.handlePrompt.mockResolvedValueOnce(
        'Chào bạn! Tôi là Scholar AI, trợ lý tư vấn du học Mỹ.',
      );
      mockAgentService.getOrCreateSession.mockResolvedValueOnce({
        ...mockSession,
        phase: Phase.INTRO,
      });

      let result = await controller.handleMessage(
        { userId: 'test-user-123', message: 'Xin chào' },
        { headers: { authorization: 'Bearer test-token' } },
      );

      expect(result.phase).toBe(Phase.INTRO);

      // Test collect_info phase
      mockAgentService.handlePrompt.mockResolvedValueOnce(
        'Hãy cho tôi biết về điểm GPA và điểm TOEFL của bạn.',
      );
      mockAgentService.getOrCreateSession.mockResolvedValueOnce({
        ...mockSession,
        phase: Phase.COLLECT_INFO,
      });

      result = await controller.handleMessage(
        { userId: 'test-user-123', message: 'Tôi có GPA 3.8 và TOEFL 100' },
        { headers: { authorization: 'Bearer test-token' } },
      );

      expect(result.phase).toBe(Phase.COLLECT_INFO);

      // Test select_school phase
      mockAgentService.handlePrompt.mockResolvedValueOnce(
        'Dựa trên thông tin, tôi gợi ý MIT, Harvard, Stanford.',
      );
      mockAgentService.getOrCreateSession.mockResolvedValueOnce({
        ...mockSession,
        phase: Phase.SELECT_SCHOOL,
      });

      result = await controller.handleMessage(
        { userId: 'test-user-123', message: 'Tôi chọn MIT' },
        { headers: { authorization: 'Bearer test-token' } },
      );

      expect(result.phase).toBe(Phase.SELECT_SCHOOL);
    });
  });
});
