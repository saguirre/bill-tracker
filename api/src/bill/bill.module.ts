import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { BillController } from './bill.controller';
import { BillRepository } from './bill.repository';
import { BillService } from './bill.service';

@Module({
  controllers: [BillController],
  providers: [BillService, BillRepository, PrismaService],
})
export class BillModule {}
