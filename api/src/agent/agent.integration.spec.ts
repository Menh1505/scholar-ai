// agent.integration.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { AgentModule } from './agent.module';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import { Phase } from './schema/agent.schema';

describe('Agent Integration Tests', () => {
  let app: TestingModule;
  let controller: AgentController;
  let service: AgentService;
  let mongoServer: MongoMemoryServer;
  let mongoConnection: Connection;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    app = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(mongoUri), AgentModule],
    }).compile();

    controller = app.get<AgentController>(AgentController);
    service = app.get<AgentService>(AgentService);
    mongoConnection = app.get<Connection>(getConnectionToken());
  });

  afterAll(async () => {
    await mongoConnection.close();
    await mongoServer.stop();
    await app.close();
  });

  afterEach(async () => {
    // Clean up database after each test
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  describe('Complete Agent Flow', () => {
    const userId = 'integration-test-user';
    const mockRequest = {
      headers: { authorization: 'Bearer test-token' },
    };

    it('should complete full study abroad consultation flow', async () => {
      // Step 1: Initial greeting - INTRO phase
      let response = await controller.handleMessage(
        { userId, message: 'Xin chào, tôi muốn tư vấn du học Mỹ' },
        mockRequest,
      );

      expect(response.phase).toBe(Phase.INTRO);
      expect(response.response).toContain('Scholar AI');

      // Step 2: Provide academic information - COLLECT_INFO phase
      response = await controller.handleMessage(
        {
          userId,
          message:
            'Tôi có GPA 3.8, TOEFL 105, muốn học Computer Science, ngân sách 60000$/năm',
        },
        mockRequest,
      );

      // Phase should progress to COLLECT_INFO or SELECT_SCHOOL
      expect([Phase.COLLECT_INFO, Phase.SELECT_SCHOOL]).toContain(
        response.phase,
      );

      // Step 3: Select school - SELECT_SCHOOL phase
      response = await controller.handleMessage(
        { userId, message: 'Tôi muốn chọn MIT' },
        mockRequest,
      );

      expect([Phase.SELECT_SCHOOL, Phase.LEGAL_CHECKLIST]).toContain(
        response.phase,
      );

      // Step 4: Legal checklist creation - LEGAL_CHECKLIST phase
      response = await controller.handleMessage(
        { userId, message: 'Tôi cần danh sách giấy tờ' },
        mockRequest,
      );

      expect([Phase.LEGAL_CHECKLIST, Phase.PROGRESS_TRACKING]).toContain(
        response.phase,
      );

      // Step 5: Progress tracking - PROGRESS_TRACKING phase
      response = await controller.handleMessage(
        { userId, message: 'Tôi đã hoàn thành I-20' },
        mockRequest,
      );

      expect(response.phase).toBe(Phase.PROGRESS_TRACKING);

      // Verify session state
      const sessionData = await controller.getSession(userId);
      expect(sessionData.userId).toBe(userId);
      expect(sessionData.phase).toBe(Phase.PROGRESS_TRACKING);
      expect(sessionData.selectedSchool).toBeTruthy();
    });

    it('should handle session reset', async () => {
      // Create a session first
      await controller.handleMessage({ userId, message: 'Hello' }, mockRequest);

      // Reset session
      await controller.resetSession(userId);

      // Verify session is reset
      const sessionData = await controller.getSession(userId);
      expect(sessionData.phase).toBe(Phase.INTRO);
      expect(sessionData.selectedSchool).toBeNull();
    });

    it('should handle session completion', async () => {
      // Create a session first
      await controller.handleMessage({ userId, message: 'Hello' }, mockRequest);

      // Complete session
      await controller.completeSession(userId);

      // Verify session is completed
      const sessionData = await controller.getSession(userId);
      expect(sessionData.isCompleted).toBe(true);
    });

    it('should maintain conversation history', async () => {
      // Send multiple messages
      await controller.handleMessage(
        { userId, message: 'Message 1' },
        mockRequest,
      );
      await controller.handleMessage(
        { userId, message: 'Message 2' },
        mockRequest,
      );
      await controller.handleMessage(
        { userId, message: 'Message 3' },
        mockRequest,
      );

      // Get message history
      const history = await controller.getMessageHistory(userId, {
        query: { limit: '10', offset: '0' },
      });

      expect(history.total).toBeGreaterThanOrEqual(6); // 3 user + 3 agent messages
      expect(history.messages).toBeInstanceOf(Array);
      expect(history.messages.length).toBeGreaterThan(0);
    });

    it('should handle user info updates', async () => {
      const userInfo = {
        gpa: 3.9,
        toeflScore: 110,
        desiredMajor: 'Computer Science',
        budget: 70000,
      };

      await service.updateUserInfo(userId, userInfo);

      const sessionData = await controller.getSession(userId);
      expect(sessionData.userInfo).toEqual(userInfo);
    });

    it('should handle legal checklist operations', async () => {
      const document = {
        name: 'I-20',
        id: 'doc-123',
        status: 'pending' as const,
        createdAt: new Date(),
      };

      await service.addToLegalChecklist(userId, document);

      const sessionData = await controller.getSession(userId);
      expect(sessionData.legalChecklist).toHaveLength(1);
      expect(sessionData.legalChecklist[0].name).toBe('I-20');
    });

    it('should provide session statistics', async () => {
      // Create some session activity
      await controller.handleMessage({ userId, message: 'Hello' }, mockRequest);

      const stats = await service.getSessionStats(userId);
      expect(stats).toHaveProperty('totalMessages');
      expect(stats).toHaveProperty('currentPhase');
      expect(stats).toHaveProperty('progressPercentage');
      expect(stats).toHaveProperty('isCompleted');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid user input gracefully', async () => {
      const invalidInputs = [
        { userId: '', message: 'Hello' },
        { userId: 'user', message: '' },
        { userId: 'user', message: 'a'.repeat(1001) },
      ];

      for (const input of invalidInputs) {
        await expect(
          controller.handleMessage(input, { headers: {} }),
        ).rejects.toThrow();
      }
    });

    it('should handle service errors gracefully', async () => {
      // Mock service to throw error
      jest
        .spyOn(service, 'handlePrompt')
        .mockRejectedValueOnce(new Error('Service error'));

      await expect(
        controller.handleMessage(
          { userId: 'test', message: 'Hello' },
          { headers: {} },
        ),
      ).rejects.toThrow();
    });
  });

  describe('Performance Tests', () => {
    it('should handle concurrent requests', async () => {
      const promises = Array.from({ length: 10 }, (_, i) =>
        controller.handleMessage(
          { userId: `user-${i}`, message: `Hello ${i}` },
          { headers: { authorization: 'Bearer test-token' } },
        ),
      );

      const results = await Promise.all(promises);
      expect(results).toHaveLength(10);
      results.forEach((result, index) => {
        expect(result.phase).toBe(Phase.INTRO);
        expect(result.response).toBeTruthy();
      });
    });

    it('should handle large message history', async () => {
      const userId = 'performance-test-user';

      // Send many messages
      const promises = Array.from({ length: 50 }, (_, i) =>
        controller.handleMessage(
          { userId, message: `Message ${i}` },
          { headers: { authorization: 'Bearer test-token' } },
        ),
      );

      await Promise.all(promises);

      const history = await controller.getMessageHistory(userId, {
        query: { limit: '100', offset: '0' },
      });

      expect(history.total).toBe(100); // 50 user + 50 agent messages
      expect(history.messages).toHaveLength(100);
    });
  });
});
