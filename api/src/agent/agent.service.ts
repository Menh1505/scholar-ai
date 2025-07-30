import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AgentSession, AgentSessionDocument } from './schema/agent.schema';
import { validateAgentConfig } from './agent.config';
import {
  AgentSessionService,
  AgentPhaseService,
  AgentExtractionService,
  AgentAnalyticsService,
  AgentPromptService,
  AgentChatService,
} from './services';
import { UserService } from '../user/user.service';
import { LegalService } from '../legal/legal.service';

@Injectable()
export class AgentService {
  constructor(
    @InjectModel(AgentSession.name)
    private sessionModel: Model<AgentSessionDocument>,
    private readonly sessionService: AgentSessionService,
    private readonly phaseService: AgentPhaseService,
    private readonly extractionService: AgentExtractionService,
    private readonly analyticsService: AgentAnalyticsService,
    private readonly promptService: AgentPromptService,
    private readonly chatService: AgentChatService,
    private readonly userService: UserService,
    private readonly legalService: LegalService,
  ) {
    // Validate configuration on service initialization
    try {
      validateAgentConfig();
    } catch (error) {
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
  ): Promise<string> {
    try {
      const session = await this.getOrCreateSession(userId);

      // Extract and update all user information from message
      this.extractionService.extractAndUpdateUserInfo(message, session);

      // Add user message to session
      this.chatService.addUserMessage(session, message);

      // Process message with LangChain
      const responseContent = await this.chatService.processMessage(
        session,
        message,
      );

      // Add agent response to session
      this.chatService.addAgentMessage(session, responseContent);

      // Update phase based on conversation
      await this.phaseService.updatePhase(session, message, responseContent);

      // Update analytics
      this.analyticsService.updateAnalytics(session, 'message_sent');

      // Save session
      await session.save();

      return responseContent;
    } catch (error) {
      throw error;
    }
  }
}
