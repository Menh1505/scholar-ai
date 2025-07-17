// agent.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import { AgentSession, AgentSessionSchema } from './schema/agent.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AgentSession.name, schema: AgentSessionSchema },
    ]),
  ],
  controllers: [AgentController],
  providers: [AgentService],
})
export class AgentModule {}
