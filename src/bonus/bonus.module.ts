import { Module } from '@nestjs/common';
import { BonusController } from './bonus.controller';

@Module({
  imports: [],
  providers: [],
  controllers: [BonusController],
})
export class BonusModule {}
