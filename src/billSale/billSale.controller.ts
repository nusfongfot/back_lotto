import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Controller('api/billSale')
export class BillSaleController {
  constructor() {}

  @Post('transferMoney')
  async transferMoney(@Body() body) {
    try {
      const data = await prisma.billSale.update({
        data: {
          transferMoneyDate: body.transferMoneyDate,
          transferMoneyTime: body.transferMoneyTime,
          price: Number(body.price),
        },
        where: {
          id: Number(body.billSaleId),
        },
      });

      return { data, message: 'success' };
    } catch (error) {
      console.log('error', error);
      return error;
    }
  }
  @Post('deliveryMoney')
  async deliveryMoney(@Body() body) {
    try {
      const data = await prisma.billSale.update({
        data: {
          deliveryDate: body.deliveryDate,
          price: Number(body.price),
        },
        where: {
          id: Number(body.billSaleId),
        },
      });

      return { data, message: 'success' };
    } catch (error) {
      return error;
    }
  }

  @Get('income')
  async getInCome(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    try {
      const data = await prisma.billSaleDetail.findMany({
        where: {
          billSale: {
            payDate: {
              not: null,
              gte: new Date(startDate).toISOString(),
              lte: new Date(endDate).toISOString(),
            },
          },
        },
        include: {
          lotto: true,
          billSale: true,
        },
      });
      return { data };
    } catch (error) {
      return { error };
    }
  }

  @Get('profit')
  async getProfit(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    try {
      const billSaleDetails = await prisma.billSaleDetail.findMany({
        where: {
          billSale: {
            payDate: {
              gte: new Date(startDate).toISOString(),
              lte: new Date(endDate).toISOString(),
            },
          },
        },
        include: {
          lotto: true,
        },
      });

      const lottoIsBonus = await prisma.lottoIsBonus.findMany({
        where: {
          bonusResultDetail: {
            bonusDate: {
              gte: new Date(startDate).toISOString(),
              lte: new Date(endDate).toISOString(),
            },
          },
        },
        include: {
          bonusResultDetail: true,
        },
      });
      return {
        billSaleDetails,
        lottoIsBonus,
      };
    } catch (error) {
      return error;
    }
  }
}
