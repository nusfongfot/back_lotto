import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BillSaleForSend, Lotto, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Controller('api/lotto')
export class LottoController {
  constructor() {}

  @Get('all')
  async listOfLotto() {
    try {
      const data = await prisma.lotto.findMany({
        orderBy: {
          isInStock: 'desc',
        },
      });
      return { data };
    } catch (error) {
      return error;
    }
  }

  @Get('listForSale')
  async listOfLottoForSale() {
    try {
      const data = await prisma.lotto.findMany({
        orderBy: {
          id: 'desc',
        },
        where: {
          isInStock: true,
        },
      });
      return { data };
    } catch (error) {
      return error;
    }
  }

  @Post('insert')
  async create(@Body() lotto: Lotto) {
    try {
      const body = {
        number: lotto.number,
        roundNumber: Number(lotto.roundNumber),
        bookNumber: Number(lotto.bookNumber),
        cost: Number(lotto.cost),
        sale: Number(lotto.sale),
      };
      const data = await prisma.lotto.create({ data: body });
      return { data };
    } catch (error) {
      return error;
    }
  }

  @Put('edit/:id')
  async editLotto(@Body() lotto: Lotto, @Param('id') id: string) {
    try {
      const body = {
        number: lotto.number,
        roundNumber: Number(lotto.roundNumber),
        bookNumber: Number(lotto.bookNumber),
        cost: Number(lotto.cost),
        sale: Number(lotto.sale),
      };
      const data = await prisma.lotto.update({
        data: body,
        where: {
          id: Number(id),
        },
      });
      return { data, message: 'edit successfully' };
    } catch (error) {
      return error;
    }
  }

  @Delete('remove/:id')
  async removeLotto(@Param('id') id: string) {
    try {
      await prisma.lotto.delete({
        where: {
          id: Number(id),
        },
      });
      return { message: 'delete successfully' };
    } catch (error) {
      return error;
    }
  }

  @Get('search')
  async searchNumberLotto(
    @Query('number') input: string,
    @Query('position') position: string,
  ) {
    let condition = {};

    if (position == 'start') {
      condition = {
        startsWith: input,
      };
    } else {
      condition = {
        endsWith: input,
      };
    }

    try {
      const data = await prisma.lotto.findMany({
        where: {
          number: condition,
          isInStock: true,
        },
      });
      return { data };
    } catch (error) {
      return error;
    }
  }

  @Post('confirmBuy')
  async confirmBy(@Body() dataBody: any) {
    try {
      const res = await prisma.billSale.create({
        data: {
          customerName: dataBody.customerName,
          customerPhone: dataBody.customerPhone,
          customerAddress: dataBody.customerAddress,
        },
      });

      if (res.id != undefined) {
        for (let index = 0; index < dataBody.carts.length; index++) {
          const item = dataBody.carts[index];

          await prisma.billSaleDetail.create({
            data: {
              billSaleId: Number(res.id),
              lottoId: Number(item.lottoId),
            },
          });
        }
        return { message: 'create billSale successfully' };
      }
      return { message: 'insert error' };
    } catch (error) {
      return error;
    }
  }

  @Get('billSale')
  async billSales() {
    try {
      const data = await prisma.billSale.findMany({
        include: {
          BillSaleDetail: {
            select: {
              lotto: true,
            },
          },
        },
        orderBy: {
          id: 'desc',
        },
        where: {
          payDate: null,
        },
      });
      return { data };
    } catch (error) {
      return error;
    }
  }

  @Delete('removeBill/:id')
  async removeBillSale(@Param('id') id: string) {
    try {
      //remove child first
      const removeBillSaleDetail = prisma.billSaleDetail.deleteMany({
        where: {
          billSaleId: Number(id),
        },
      });
      const removeBillSale = prisma.billSale.delete({
        where: {
          id: Number(id),
        },
      });

      await prisma.$transaction([removeBillSaleDetail, removeBillSale]);

      return { message: 'delete successfully' };
    } catch (error) {
      return error;
    }
  }

  @Put('confirmPay')
  async confirmPay(@Body() dataBody: any) {
    try {
      await prisma.billSale.update({
        data: {
          payDate: dataBody.payDate,
          payTime: dataBody.payTime,
          payAlertDate: dataBody.payAlertDate,
          payRemark: dataBody.payRemark,
        },
        where: {
          id: Number(dataBody.billId),
        },
      });

      const lottos = await prisma.billSaleDetail.findMany({
        where: {
          billSaleId: Number(dataBody.billId),
        },
        include: {
          lotto: true,
        },
      });

      for (let i = 0; i < lottos.length; i++) {
        const item = lottos[i];
        await prisma.lotto.update({
          data: {
            isInStock: false,
          },
          where: {
            id: Number(item.lotto.id),
          },
        });
      }

      return { message: 'update successfully' };
    } catch (error) {
      return error;
    }
  }

  @Get('/lottoInShop')
  async getLottoInShop() {
    try {
      const data = await prisma.billSale.findMany({
        orderBy: {
          id: 'desc',
        },
        where: {
          payDate: {
            not: null,
          },
          customerAddress: '',
        },
        include: {
          BillSaleDetail: {
            include: {
              lotto: true,
            },
          },
        },
      });
      return { data };
    } catch (error) {
      return error;
    }
  }

  @Get('/lottoToSend')
  async getLottoToSend() {
    try {
      const data = await prisma.billSale.findMany({
        orderBy: {
          id: 'desc',
        },
        where: {
          payDate: {
            not: null,
          },
          customerAddress: {
            not: '',
          },
        },
        include: {
          BillSaleDetail: {
            include: {
              lotto: true,
            },
          },
          BillSaleForSend: true,
        },
      });
      return { data };
    } catch (error) {
      return error;
    }
  }

  @Post('/recordForSend')
  async recordOfDelivery(@Body() dataBody: BillSaleForSend) {
    try {
      const body = {
        billSaleId: Number(dataBody.billSaleId),
        sender: dataBody.sender,
        sendDate: dataBody.sendDate,
        sendTime: dataBody.sendTime,
        trackCode: dataBody.trackCode,
        sendPlatform: dataBody.sendPlatform,
        remark: dataBody.remark,
        shippingCost: Number(dataBody.shippingCost),
      };
      const rowCount = await prisma.billSaleForSend.findMany({
        where: {
          billSaleId: body.billSaleId,
        },
      });
      if (rowCount.length == 0) {
        const data = await prisma.billSaleForSend.create({ data: body });
        if (data != undefined) {
          return { data, message: 'record successfully' };
        }
      } else {
        return { message: 'record is exists' };
      }
    } catch (error) {
      console.log('error', error);
      return error;
    }
  }

  @Put('changePrice')
  async changePrice(@Body() body) {
    try {
      for (const data in body) {
        if (body.hasOwnProperty(data)) {
          const item = body[data];
          await prisma.lotto.update({
            where: {
              id: Number(item.id),
            },
            data: {
              sale: Number(item.newPrice),
            },
          });
        }
      }
      return { message: 'success' };
    } catch (error) {
      return error;
    }
  }
}
