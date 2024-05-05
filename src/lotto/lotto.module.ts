import { Module } from '@nestjs/common';
import { LottoController } from './lotto.controller';

@Module({
  imports: [],
  providers: [],
  controllers: [LottoController],
})
export class LottoModule {}
