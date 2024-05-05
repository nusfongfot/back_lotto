import { Body, Controller, Get, Post } from '@nestjs/common';
import { PrismaClient, Company } from '@prisma/client';

const prisma = new PrismaClient();

@Controller('api/company')
export class CompanyController {
  constructor() {}

  @Get('info')
  async getInfo() {
    try {
      const data = await prisma.company.findFirst();
      return { data };
    } catch (error) {
      return error.message;
    }
  }

  @Post('insert')
  async create(@Body() company: Company) {
    try {
      const companyData = await prisma.company.findMany();
      if (companyData.length > 0) {
        await prisma.company.update({
          data: company,
          where: {
            id: 1,
          },
        });
      } else {
        const data = await prisma.company.create({ data: company });
        return { data };
      }
    } catch (error) {
      return error.message;
    }
  }
}
