import { Module } from '@nestjs/common';
import { BillService } from 'src/bill/bill.service';
import { CategoryService } from 'src/category/category.service';
import { PrismaService } from 'src/prisma.service';
import { HistoricController } from './historic.controller';
import { HistoricService } from './historic.service';

@Module({
  controllers: [HistoricController],
  providers: [HistoricService, BillService, CategoryService, PrismaService],
})
export class HistoricModule {}
