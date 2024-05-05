import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() user: { email: string; password: string }) {
    try {
      const dataUser = await prisma.user.findFirst({
        where: { email: user.email },
      });
      if (!dataUser) {
        throw new BadRequestException('email or password is invalid');
      }
      const comparePwd = await this.authService.comparePassword(
        user.password,
        dataUser.password,
      );
      if (!comparePwd) {
        throw new BadRequestException('email or password is invalid');
      }
      const data = await prisma.user.findFirst({
        where: { email: user.email },
        select: {
          id: true,
          email: true,
          level: true,
          name: true,
          phone: true,
          user: true,
        },
      });
      const token = await this.authService.getnToken(data.email);
      return { data, token };
    } catch (error) {
      return error;
    }
  }
}
