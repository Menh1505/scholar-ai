import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LegalService } from './legal.service';
import { LegalController } from './legal.controller';
import { LegalSchema } from './schemas/legal.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Legal', schema: LegalSchema }]),
  ],
  controllers: [LegalController],
  providers: [LegalService],
  exports: [LegalService],
})
export class LegalModule {}
