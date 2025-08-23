import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [ConfigModule, forwardRef(() => UserModule)],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
