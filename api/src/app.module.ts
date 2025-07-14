import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LegalModule } from './legal/legal.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';
import { AgentModule } from './agent/agent.module';

@Module({
  imports: [DatabaseModule, LegalModule, AuthModule, HealthModule, UserModule, AgentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
