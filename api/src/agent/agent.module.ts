// agent.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import { AgentSession, AgentSessionSchema } from './schema/agent.schema';
import {
  AgentSessionService,
  AgentPhaseService,
  AgentExtractionService,
  AgentAnalyticsService,
  AgentPromptService,
  AgentChatService,
} from './services';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AgentSession.name, schema: AgentSessionSchema },
    ]),
  ],
  controllers: [AgentController],
  providers: [
    AgentService,
    AgentSessionService,
    AgentPhaseService,
    AgentExtractionService,
    AgentAnalyticsService,
    AgentPromptService,
    AgentChatService,
  ],
})
export class AgentModule {}
