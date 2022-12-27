import { Module } from '@nestjs/common';
import { BillService } from 'src/bill/bill.service';
import { PrismaService } from 'src/prisma.service';
import { HistoricController } from './historic.controller';
import { HistoricService } from './historic.service';

@Module({
  controllers: [HistoricController],
  providers: [HistoricService, BillService, PrismaService],
})
export class HistoricModule {}
