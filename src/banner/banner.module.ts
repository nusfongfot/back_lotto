import { Module } from '@nestjs/common';
import { BannerController } from './banner.controller';

@Module({
  imports: [],
  providers: [],
  controllers: [BannerController],
})
export class BannerModule {}
