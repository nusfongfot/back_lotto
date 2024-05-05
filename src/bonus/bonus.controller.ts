import { Controller, Get, Param, Post } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

@Controller('api/bonus')
export class BonusController {
  constructor() {}

  @Post('list')
  async getBonus() {
    try {
      const res = await axios.post(
        'https://www.glo.or.th/api/lottery/getLatestLottery',
      );
      const date = new Date(res.data.response.date);
      const data = res.data.response.data;
      const firstPrice = data.first;
      const secondPrice = data.second;
      const thirdPrice = data.third;
      const fourthPrice = data.fourth;
      const fifthPrice = data.fifth;
      const last3f = data.last3f;
      const last3b = data.last3b;
      const last2 = data.last2;
      const near1 = data.near1;

      const rows = await prisma.bonusResultDetail.findMany({
        where: {
          bonusDate: date,
        },
      });

      if (rows.length == 0) {
        for (let i = 0; i < firstPrice.number.length; i++) {
          await prisma.bonusResultDetail.create({
            data: {
              number: firstPrice.number[i].value,
              price: Number(firstPrice.price),
              bonusDate: date,
              priceName: '1',
            },
          });
        }

        for (let i = 0; i < secondPrice.number.length; i++) {
          await prisma.bonusResultDetail.create({
            data: {
              number: secondPrice.number[i].value,
              price: Number(secondPrice.price),
              bonusDate: date,
              priceName: '2',
            },
          });
        }

        for (let i = 0; i < thirdPrice.number.length; i++) {
          await prisma.bonusResultDetail.create({
            data: {
              number: thirdPrice.number[i].value,
              price: Number(thirdPrice.price),
              bonusDate: date,
              priceName: '3',
            },
          });
        }

        for (let i = 0; i < fourthPrice.number.length; i++) {
          await prisma.bonusResultDetail.create({
            data: {
              number: fourthPrice.number[i].value,
              price: Number(fourthPrice.price),
              bonusDate: date,
              priceName: '4',
            },
          });
        }

        for (let i = 0; i < fifthPrice.number.length; i++) {
          await prisma.bonusResultDetail.create({
            data: {
              number: fifthPrice.number[i].value,
              price: Number(fifthPrice.price),
              bonusDate: date,
              priceName: '5',
            },
          });
        }

        for (let i = 0; i < last3f.number.length; i++) {
          await prisma.bonusResultDetail.create({
            data: {
              number: last3f.number[i].value,
              price: Number(last3f.price),
              bonusDate: date,
              priceName: '3ตัวหน้า',
            },
          });
        }

        for (let i = 0; i < last3b.number.length; i++) {
          await prisma.bonusResultDetail.create({
            data: {
              number: last3b.number[i].value,
              price: Number(last3b.price),
              bonusDate: date,
              priceName: '3ตัวหลัง',
            },
          });
        }

        for (let i = 0; i < last2.number.length; i++) {
          await prisma.bonusResultDetail.create({
            data: {
              number: last2.number[i].value,
              price: Number(last2.price),
              bonusDate: date,
              priceName: 'เลขท้าย2ตัว',
            },
          });
        }

        for (let i = 0; i < near1.number.length; i++) {
          await prisma.bonusResultDetail.create({
            data: {
              number: near1.number[i].value,
              price: Number(near1.price),
              bonusDate: date,
              priceName: 'ใกล้เคียงรางวัลที่1',
            },
          });
        }
        return { message: 'success' };
      }

      return { data: res.data, message: 'data exists' };
    } catch (error) {
      return error;
    }
  }

  @Get('listDate')
  async listDate() {
    try {
      const data = await prisma.bonusResultDetail.groupBy({
        by: ['bonusDate'],
        orderBy: {
          bonusDate: 'desc',
        },
      });

      const resDetail = await prisma.bonusResultDetail.findMany({
        where: {
          bonusDate: data[0].bonusDate,
        },
        orderBy: {
          price: 'desc',
        },
      });

      return { data, details: resDetail };
    } catch (error) {
      return error;
    }
  }

  @Get('listDetailBonus/:date')
  async listDetailBonus(@Param('date') date: string) {
    try {
      const data = await prisma.bonusResultDetail.findMany({
        where: {
          bonusDate: new Date(date),
        },
        orderBy: {
          price: 'desc',
        },
      });

      return { data };
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Get('checkBonus')
  async checkBonus() {
    try {
      const billSaleDetail = await prisma.billSaleDetail.findMany({
        include: {
          lotto: true,
        },
        where: {
          billSale: {
            payDate: {
              not: null,
            },
            customerAddress: '',
          },
          lotto: {
            isCheckBonus: false,
          },
        },
      });

      const lastBonusResult = await prisma.bonusResultDetail.findFirst({
        orderBy: {
          bonusDate: 'desc',
        },
      });

      const bonusResultDetail = await prisma.bonusResultDetail.findMany({
        where: {
          bonusDate: lastBonusResult.bonusDate,
        },
      });

      for (let i = 0; i < billSaleDetail.length; i++) {
        const myNumber = billSaleDetail[i];
        for (let j = 0; j < bonusResultDetail.length; j++) {
          const bonus = bonusResultDetail[j];
          if (myNumber.lotto.number.includes(bonus.number)) {
            await prisma.billSaleDetailBonus.create({
              data: {
                billSaleDetailId: myNumber.id,
                number: bonus.number,
                bonusPrice: +bonus.price,
                bonusDate: bonus.bonusDate,
                bonusName: bonus.priceName,
              },
            });
          }
        }
      }
      await prisma.lotto.updateMany({
        data: {
          isCheckBonus: true,
        },
        where: {
          isCheckBonus: false,
        },
      });

      const data = await prisma.billSaleDetailBonus.findMany({
        include: {
          billSaleDetail: {
            include: {
              lotto: {
                select: {
                  number: true,
                },
              },
              billSale: {
                select: {
                  customerName: true,
                  customerPhone: true,
                  transferMoneyDate: true,
                  transferMoneyTime: true,
                  price: true,
                  deliveryDate: true,
                },
              },
            },
          },
        },
      });

      return { message: 'success', data };
    } catch (error) {
      return error;
    }
  }

  @Get('lottoIsBonus')
  async lottoIsBonus() {
    try {
      const bonusResultLastest = await prisma.bonusResultDetail.findFirst({
        orderBy: {
          bonusDate: 'desc',
        },
      });

      const bonusResults = await prisma.bonusResultDetail.findMany({
        where: {
          bonusDate: bonusResultLastest.bonusDate,
        },
      });

      const lottosInShop = await prisma.lotto.findMany({
        where: {
          isInStock: true,
        },
      });

      for (let i = 0; i < lottosInShop.length; i++) {
        const myNumber = lottosInShop[i];
        for (let j = 0; j < bonusResults.length; j++) {
          const bonusResult = bonusResults[j];
          if (myNumber.number.includes(bonusResult.number)) {
            const findRow = await prisma.lottoIsBonus.findFirst({
              where: {
                bonusResultDetailId: bonusResult.id,
              },
            });
            if (findRow == null) {
              await prisma.lottoIsBonus.create({
                data: {
                  bonusResultDetailId: bonusResult.id,
                  lottoId: myNumber.id,
                },
              });
            }
          }
        }
      }
      return { message: 'success' };
    } catch (error) {
      return error;
    }
  }

  @Get('lottoIsBonusLists')
  async lottoIsBonusLists() {
    try {
      const data = await prisma.lottoIsBonus.findMany({
        orderBy: {
          id: 'desc',
        },
        include: {
          bonusResultDetail: true,
          lotto: {
            select: {
              number: true,
            },
          },
        },
      });
      return { data };
    } catch (error) {
      return error;
    }
  }
}
