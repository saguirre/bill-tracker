import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { Bill, Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BillService } from './bill.service';
import { BillEntity } from './entities/bill.entity';
import { CreateBillEntity } from './entities/create-bill.entity';

@Controller('bill')
export class BillController {
  constructor(private readonly billService: BillService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: BillEntity })
  @Get('/:id')
  async getUserById(@Param('id') id: string): Promise<Partial<Bill>> {
    const bill = await this.billService.bill({ id: Number(id) });
    return bill;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: BillEntity, isArray: true })
  @Get()
  async getBills(): Promise<Bill[]> {
    const bills = await this.billService.bills({});
    return bills;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: BillEntity, isArray: true })
  @Get('/user/:id')
  async getBillsByUserId(@Param('id') id: string): Promise<Bill[]> {
    const bills = await this.billService.bills({
      where: { userId: Number(id) },
    });
    return bills;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: BillEntity, isArray: true })
  @Get('/group/:id')
  async getBillsByGroupId(@Param('id') id: string): Promise<Bill[]> {
    const bills = await this.billService.bills({
      where: { userGroupId: Number(id) },
    });
    return bills;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: BillEntity, isArray: true })
  @Get('/group/:groupId/user/:id')
  async getBillsByGroupIdAndUserId(
    @Param('groupId') groupId: string,
    @Param('id') id: string,
  ): Promise<Bill[]> {
    const bills = await this.billService.bills({
      where: { userGroupId: Number(groupId), userId: Number(id) },
    });
    return bills;
  }

  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: BillEntity })
  @Post('user/:id')
  async createBill(
    @Param('id') id: string,
    @Body() bill: CreateBillEntity,
  ): Promise<Bill> {
    const createdBill = await this.billService.createBill({
      ...bill,
      user: { connect: { id: Number(id) } },
    });
    return createdBill;
  }

  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: BillEntity })
  @Post('/group/:groupId/user/:id')
  async createBillByGroupId(
    @Param('groupId') groupId: string,
    @Param('id') id: string,
    @Body() bill: CreateBillEntity,
  ): Promise<Bill> {
    const createdBill = await this.billService.createBill({
      ...bill,
      user: { connect: { id: Number(id) } },
      userGroup: { connect: { id: Number(id) } },
    });
    return createdBill;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: BillEntity })
  @Put('/:id')
  async updateBill(
    @Param('id') id: string,
    @Body() bill: CreateBillEntity,
  ): Promise<Bill> {
    const updatedBill = await this.billService.updateBill({
      where: { id: Number(id) },
      data: bill,
    });
    return updatedBill;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: BillEntity })
  @Delete('/:id')
  async deleteBill(@Param('id') id: string): Promise<Bill> {
    const deletedBill = await this.billService.deleteBill({
      id: Number(id),
    });
    return deletedBill;
  }
}
