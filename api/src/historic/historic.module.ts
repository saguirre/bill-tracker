import { Module } from '@nestjs/common';
import { BillRepository } from 'src/bill/bill.repository';
import { CategoryRepository } from 'src/category/category.repository';
import { PrismaService } from 'src/prisma.service';
import { HistoricController } from './historic.controller';
import { HistoricService } from './historic.service';

@Module({
  controllers: [HistoricController],
  providers: [
    HistoricService,
    BillRepository,
    CategoryRepository,
    PrismaService,
  ],
})
export class HistoricModule {}
