import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Bill, Prisma } from '@prisma/client';

@Injectable()
export class BillRepository {
  constructor(private prisma: PrismaService) {}

  async findUnique(
    params: Prisma.BillFindUniqueArgs,
  ): Promise<Partial<Bill> | null> {
    return this.prisma.bill.findUnique(params);
  }

  async findMany(params: Prisma.BillFindManyArgs): Promise<Bill[]> {
    return this.prisma.bill.findMany(params);
  }

  async create(params: Prisma.BillCreateArgs): Promise<Bill> {
    return this.prisma.bill.create(params);
  }

  async update(params: Prisma.BillUpdateArgs): Promise<Bill> {
    return this.prisma.bill.update(params);
  }

  async delete(params: Prisma.BillDeleteArgs): Promise<Bill> {
    return this.prisma.bill.delete(params);
  }
}
