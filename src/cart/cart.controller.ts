import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { PrismaClient, Cart } from '@prisma/client';

const prisma = new PrismaClient();

@Controller('api/cart')
export class CartController {
  constructor() {}

  @Post('insert')
  async createCart(@Body() cart: Cart) {
    try {
      const body = {
        userId: Number(cart.userId),
        lottoId: Number(cart.lottoId),
      };
      const data = await prisma.cart.create({ data: body });
      return { data };
    } catch (error) {
      return error;
    }
  }

  @Delete('remove/:id')
  async removeCart(@Param('id') id: string) {
    try {
      await prisma.cart.delete({
        where: {
          id: Number(id),
        },
      });
      return { message: 'delete successfully' };
    } catch (error) {
      return error;
    }
  }

  @Get('list')
  async listCart(@Query('userId') userId: string) {
    try {
      const data = await prisma.cart.findMany({
        include: {
          lotto: true,
          user: {
            select: {
              email: true,
              level: true,
              name: true,
              phone: true,
              user: true,
            },
          },
        },
        where: {
          userId: Number(userId),
        },
      });
      return { data };
    } catch (error) {
      return;
    }
  }
}
