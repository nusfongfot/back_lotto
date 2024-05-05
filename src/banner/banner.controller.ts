import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

const prisma = new PrismaClient();

@Controller('api/banner')
export class BannerController {
  constructor() {}

  @Post('uploadFile')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename(req, file, callback) {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      await prisma.banner.create({
        data: {
          path: file.filename,
        },
      });
      return { file, message: 'success' };
    } catch (error) {
      return error;
    }
  }

  @Get('list')
  async list() {
    try {
      const data = await prisma.banner.findMany({
        orderBy: {
          id: 'desc',
        },
      });
      return { data };
    } catch (error) {
      return error;
    }
  }
  @Delete('remove/:id')
  async remove(@Param('id') id: string) {
    try {
      const banner = await prisma.banner.findFirst({
        where: {
          id: Number(id),
        },
      });

      const res = await prisma.banner.delete({
        where: {
          id: Number(id),
        },
      });
      if (res.id !== undefined) {
        fs.unlink('./uploads/' + banner.path, (err) => {
          if (err) {
            console.log('err', err);
            return { err };
          }
        });
        return { message: 'success' };
      }
      return { message: 'error' };
    } catch (error) {
      return error;
    }
  }
}
