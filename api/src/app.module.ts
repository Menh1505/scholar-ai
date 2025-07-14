import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfileModule } from './profile/profile.module';
import { LegalModule } from './legal/legal.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ProfileModule, LegalModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
