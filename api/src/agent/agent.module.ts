// agent.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import { AgentSession, AgentSessionSchema } from './schema/agent.schema';
import {
  AgentSessionService,
  AgentPhaseService,
  AgentPromptService,
  AgentChatService,
} from './services';
import { UserModule } from '../user/user.module';
import { LegalModule } from '../legal/legal.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AgentSession.name, schema: AgentSessionSchema },
    ]),
    UserModule,
    LegalModule,
  ],
  controllers: [AgentController],
  providers: [
    AgentService,
    AgentSessionService,
    AgentPhaseService,
    AgentPromptService,
    AgentChatService,
  ],
})
export class AgentModule {}
