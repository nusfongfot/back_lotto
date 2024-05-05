import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';

@Module({
  imports: [],
  providers: [],
  controllers: [CompanyController],
})
export class CompanyModule {}
