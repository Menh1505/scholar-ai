import { Injectable } from '@nestjs/common';
import { AgentSession } from './schema/agent.schema';
import { validateAgentConfig } from './agent.config';
import {
  AgentSessionService,
  AgentPhaseService,
  AgentChatService,
} from './services';

@Injectable()
export class AgentService {
  constructor(
    private readonly sessionService: AgentSessionService,
    private readonly phaseService: AgentPhaseService,
    private readonly chatService: AgentChatService,
  ) {
    // Validate configuration on service initialization
    try {
      validateAgentConfig();
    } catch (error) {
      throw error;
    }
  }

  async updateSession(
    userId: string,
    updates: Partial<AgentSession>,
  ): Promise<void> {
    return this.sessionService.updateSession(userId, updates);
  }

  // Main chat handler
  async handlePrompt(userId: string, message: string): Promise<string> {
    try {
      const session = await this.sessionService.getOrCreateSession(userId);

      // TODO: Extract and update all user information from message

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
      await this.phaseService.updatePhase(session, message);

      // Save session
      await session.save();

      return responseContent;
    } catch (error) {
      throw error;
    }
  }
}
