// agent.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import { AgentConfigService } from './agent-config.service';
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
    AgentConfigService,
    AgentSessionService,
    AgentPhaseService,
    AgentExtractionService,
    AgentAnalyticsService,
    AgentPromptService,
    AgentChatService,
  ],
  exports: [AgentConfigService],
})
export class AgentModule {}
