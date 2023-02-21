import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { BillController } from './bill.controller';
import { BillService } from './bill.service';

@Module({
  controllers: [BillController],
  providers: [BillService, PrismaService],
})
export class BillModule {}
