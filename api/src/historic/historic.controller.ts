import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  HistoricBillsByCategory,
  HistoricBillsByMonth,
  HistoricBillsInMonth,
} from './entities/historic';
import { HistoricService } from './historic.service';

@Controller('historic')
export class HistoricController {
  constructor(private readonly historicService: HistoricService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: HistoricBillsByMonth })
  @Get('month/user/:id')
  async getHistoricBillsInMonthAndUserId(
    @Param('id') id: string,
  ): Promise<HistoricBillsInMonth> {
    const historicBillsInMonth =
      await this.historicService.historicBillsInMonth({
        where: { userId: Number(id) },
      });
    return historicBillsInMonth;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: HistoricBillsByMonth })
  @Get('months/user/:id')
  async getHistoricBillsByMonthAndUserId(
    @Param('id') id: string,
  ): Promise<HistoricBillsByMonth> {
    const historicBillsByMonth =
      await this.historicService.historicBillsByMonth({
        where: { userId: Number(id) },
      });
    return historicBillsByMonth;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: HistoricBillsByCategory })
  @Get('categories/user/:id')
  async getHistoricBillsByCategoryAndUserId(
    @Param('id') id: string,
  ): Promise<HistoricBillsByCategory> {
    const historicBillsByCategory =
      await this.historicService.historicBillsByCategory({
        where: { userId: Number(id) },
      });
    return historicBillsByCategory;
  }
}
