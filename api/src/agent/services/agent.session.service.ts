import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AgentSession,
  AgentSessionDocument,
  Phase,
} from '../schema/agent.schema';

@Injectable()
export class AgentSessionService {
  private readonly logger = new Logger(AgentSessionService.name);

  constructor(
    @InjectModel(AgentSession.name)
    private sessionModel: Model<AgentSessionDocument>,
  ) {}

  async getOrCreateSession(userId: string): Promise<AgentSessionDocument> {
    let session = await this.sessionModel.findOne({ userId });
    if (!session) {
      session = new this.sessionModel({ userId });
      await session.save();
    }
    return session;
  }

  async updateSession(
    userId: string,
    updates: Partial<AgentSession>,
  ): Promise<void> {
    await this.sessionModel.updateOne({ userId }, { $set: updates });
  }

  async resetSession(userId: string): Promise<void> {
    await this.sessionModel.deleteOne({ userId });
  }

  async getSessionStats(userId: string): Promise<any> {
    const session = await this.getOrCreateSession(userId);
    return {
      totalMessages: session.messages.length,
      currentPhase: session.phase,
      progressPercentage: (session as any).progressPercentage,
    };
  }

  async updateUserInfo(userId: string, userInfo: any): Promise<void> {
    await this.sessionModel.updateOne({ userId }, { $set: { userInfo } });
  }
}
