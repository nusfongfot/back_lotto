import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { PrismaClient, User } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
import { AuthenGuard } from 'src/auth/guards/auth.guard';

const prisma = new PrismaClient();

@Controller('api/users')
export class UsersController {
  constructor(private authService: AuthService) {}

  @Get('all')
  async getListUsers() {
    try {
      const data = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          level: true,
          name: true,
          phone: true,
          user: true,
        },
        orderBy: {
          id: 'desc',
        },
      });
      return { data };
    } catch (error) {
      return error.message;
    }
  }

  @UseGuards(AuthenGuard)
  @Get('info')
  async getInfoOfUser(@Req() req: any) {
    try {
      const data = await this.authService.checkTokenEmailOfUser(req);
      return data;
    } catch (error) {
      return error.message;
    }
  }

  @Post('insert')
  async createUser(@Body() user: User) {
    try {
      const body: any = {
        user: user.user,
        name: user.name,
        email: user.email,
        password: await this.authService.hashedPassword(user.password),
        level: user.level,
        phone: user.phone,
      };
      const data = await prisma.user.create({ data: body });
      if (data.id !== undefined) {
        return { data, message: 'success' };
      }
      return { message: 'create fail' };
    } catch (error) {
      return error;
    }
  }

  @Put('edit/:id')
  async editUser(@Body() user: User, @Param('id') id: string) {
    try {
      const data = await prisma.user.update({
        data: user,
        where: { id: Number(id) },
      });
      return { data };
    } catch (error) {
      return error.message;
    }
  }

  @Delete('remove/:id')
  async deleteUser(@Param('id') id: string) {
    try {
      const data = await prisma.user.delete({ where: { id: Number(id) } });
      return { data };
    } catch (error) {
      return error.message;
    }
  }
}
