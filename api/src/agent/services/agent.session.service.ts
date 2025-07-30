import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AgentSession,
  AgentSessionDocument,
} from '../schema/agent.schema';

@Injectable()
export class AgentSessionService {
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
}
