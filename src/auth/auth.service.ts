import { Injectable, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async validateUserById(userId: string) {
    return null;
  }

  validateToken(token: string) {
    return this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
  }

  async checkTokenEmailOfUser(@Req() req: any) {
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];
    const emailUser = await this.validateToken(token);
    const user = await prisma.user.findFirst({
      where: {
        email: emailUser.email,
      },
      select: {
        id: true,
        email: true,
        level: true,
        name: true,
        phone: true,
        user: true,
      },
    });

    return { data: user };
  }

  async getnToken(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async hashedPassword(password: string) {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(12, (err, salt) => {
        if (err) return reject(err);
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) return reject(err);
          resolve(hash);
        });
      });
    });
  }

  async comparePassword(password: string, hashed: string) {
    return bcrypt.compare(password, hashed);
  }
}
