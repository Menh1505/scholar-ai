import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import { LegalModule } from '../legal/legal.module';
import { UserModule } from '../user/user.module';
import { DatabaseModule } from '../database/database.module';

@Module({
    imports: [LegalModule, UserModule, DatabaseModule],
    controllers: [AgentController],
    providers: [AgentService],
    exports: [AgentService]
})
export class AgentModule { }
