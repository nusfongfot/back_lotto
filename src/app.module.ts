import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { CompanyModule } from './company/company.module';
import { LottoModule } from './lotto/lotto.module';
import { CartModule } from './cart/cart.module';
import { BonusModule } from './bonus/bonus.module';
import { BillSaleModule } from './billSale/billSale.module';
import { BannerModule } from './banner/banner.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env.local' }),
    // access image path
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    UsersModule,
    AuthModule,
    CompanyModule,
    LottoModule,
    CartModule,
    BonusModule,
    BillSaleModule,
    BannerModule,
    PassportModule.register({ session: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
