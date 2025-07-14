import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfileModule } from './profile/profile.module';
import { LegalModule } from './legal/legal.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [DatabaseModule, ProfileModule, LegalModule, AuthModule, HealthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
