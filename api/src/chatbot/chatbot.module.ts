import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatbotController } from './chatbot.controller';
import { ChatbotTestController } from './chatbot-test.controller';
import { ChatbotService } from './chatbot.service';
import { AgentService } from './agent.service';
import { UserModule } from '../user/user.module';
import { LegalModule } from '../legal/legal.module';
import {
  Conversation,
  ConversationSchema,
} from './schemas/conversation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
    ]),
    UserModule,
    LegalModule,
  ],
  controllers: [ChatbotController, ChatbotTestController],
  providers: [ChatbotService, AgentService],
  exports: [ChatbotService, AgentService],
})
export class ChatbotModule {}
