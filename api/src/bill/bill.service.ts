import { Injectable } from '@nestjs/common';
import { Bill, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class BillService {
  constructor(private prisma: PrismaService) {}

  async bill(
    billWhereUniqueInput: Prisma.BillWhereUniqueInput,
  ): Promise<Partial<Bill> | null> {
    const bill = await this.prisma.bill.findUnique({
      where: billWhereUniqueInput,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        category: true,
      },
    });

    return bill;
  }

  async bills(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.BillWhereUniqueInput;
    where?: Prisma.BillWhereInput;
    orderBy?: Prisma.BillOrderByWithRelationInput;
  }): Promise<Bill[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.bill.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        group: {
          select: {
            id: true,
            name: true,
          },
        },
        category: true,
      },
    });
  }

  async createBill(data: Prisma.BillCreateInput): Promise<Bill> {
    return this.prisma.bill.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async updateBill(params: {
    where: Prisma.BillWhereUniqueInput;
    data: Prisma.BillUpdateInput;
  }): Promise<Bill> {
    const { where, data } = params;
    return this.prisma.bill.update({
      data,
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        category: true,
      },
    });
  }

  async deleteBill(where: Prisma.BillWhereUniqueInput): Promise<Bill> {
    return this.prisma.bill.delete({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        category: true,
      },
    });
  }
}
