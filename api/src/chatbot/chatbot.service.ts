import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Conversation,
  ConversationDocument,
  Message,
} from './schemas/conversation.schema';
import { UserService } from '../user/user.service';
import { LegalService } from '../legal/legal.service';

@Injectable()
export class ChatbotService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    private userService: UserService,
    private legalService: LegalService,
  ) {}

  async getConversationHistory(userId: string): Promise<Message[]> {
    const conversation = await this.conversationModel.findOne({ userId });
    return conversation?.messages || [];
  }

  async getDocumentChecklist(userId: string): Promise<string[]> {
    const legalDocuments = await this.legalService.findByUserId(userId);
    return legalDocuments.map((doc) => `${doc.title} - ${doc.status}`);
  }
}
