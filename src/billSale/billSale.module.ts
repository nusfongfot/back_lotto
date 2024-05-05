import { Module } from '@nestjs/common';
import { BillSaleController } from './billSale.controller';

@Module({
  imports: [],
  providers: [],
  controllers: [BillSaleController],
})
export class BillSaleModule {}
