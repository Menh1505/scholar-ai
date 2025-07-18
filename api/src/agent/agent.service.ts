import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AgentSession, AgentSessionDocument } from './schema/agent.schema';
import { AgentConfig, validateAgentConfig } from './agent.config';
import {
  AgentSessionService,
  AgentPhaseService,
  AgentExtractionService,
  AgentAnalyticsService,
  AgentPromptService,
  AgentChatService,
} from './services';

@Injectable()
export class AgentService {
  private readonly logger = new Logger(AgentService.name);

  constructor(
    @InjectModel(AgentSession.name)
    private sessionModel: Model<AgentSessionDocument>,
    private readonly sessionService: AgentSessionService,
    private readonly phaseService: AgentPhaseService,
    private readonly extractionService: AgentExtractionService,
    private readonly analyticsService: AgentAnalyticsService,
    private readonly promptService: AgentPromptService,
    private readonly chatService: AgentChatService,
  ) {
    // Validate configuration on service initialization
    try {
      validateAgentConfig();
      this.logger.log('Agent configuration validated successfully');
    } catch (error) {
      this.logger.error(
        'Agent configuration validation failed:',
        error.message,
      );
      throw error;
    }
  }

  // Delegate session management to dedicated service
  async getOrCreateSession(userId: string): Promise<AgentSessionDocument> {
    return this.sessionService.getOrCreateSession(userId);
  }

  async updateSession(
    userId: string,
    updates: Partial<AgentSession>,
  ): Promise<void> {
    return this.sessionService.updateSession(userId, updates);
  }

  async resetSession(userId: string): Promise<void> {
    return this.sessionService.resetSession(userId);
  }

  async completeSession(userId: string): Promise<void> {
    return this.sessionService.completeSession(userId);
  }

  async getSessionStats(userId: string): Promise<any> {
    return this.sessionService.getSessionStats(userId);
  }

  async updateUserInfo(userId: string, userInfo: any): Promise<void> {
    return this.sessionService.updateUserInfo(userId, userInfo);
  }

  // Main chat handler
  async handlePrompt(
    userId: string,
    message: string,
    authToken: string,
  ): Promise<string> {
    try {
      this.logger.log(`Processing message for user ${userId}`);

      const session = await this.getOrCreateSession(userId);

      // Extract school and major from user message BEFORE processing
      console.log('🔍 Extracting school and major from:', message);
      this.extractionService.extractSchoolAndMajor(message, session);
      console.log('🔍 After extraction - School:', session.selectedSchool);
      console.log('🔍 After extraction - Major:', session.selectedMajor);

      // Add user message to session
      this.chatService.addUserMessage(session, message);

      // Process message with LangChain
      const responseContent = await this.chatService.processMessage(
        session,
        message,
        authToken,
      );

      // Add agent response to session
      this.chatService.addAgentMessage(session, responseContent);

      // Update phase based on conversation
      await this.phaseService.updatePhase(session, message, responseContent);

      // Update analytics
      this.analyticsService.updateAnalytics(session, 'message_sent');

      // Save session
      await session.save();

      this.logger.log(`Successfully processed message for user ${userId}`);
      return responseContent;
    } catch (error) {
      this.logger.error(
        `Error processing message for user ${userId}:`,
        error.message,
      );
      throw error;
    }
  }
}
