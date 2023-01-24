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
import { Bill } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BillService } from './bill.service';
import { BillEntity } from './entities/bill.entity';
import { CreateBillEntity } from './entities/create-bill.entity';
import { UpdateBillEntity } from './entities/update-bill.entity';

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
      where: { groupId: Number(id) },
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
      where: { groupId: Number(groupId), userId: Number(id) },
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
    let createBillInput;
    if (bill.categoryId && bill.groupId) {
      const { categoryId, groupId, ...rest } = bill;
      createBillInput = {
        ...rest,
        amount: Number(bill.amount),
        category: { connect: { id: Number(categoryId) } },
        group: { connect: { id: Number(groupId) } },
        user: { connect: { id: Number(id) } },
      };
    } else if (bill.categoryId) {
      const { categoryId, ...rest } = bill;
      createBillInput = {
        ...rest,
        amount: Number(bill.amount),
        category: { connect: { id: Number(categoryId) } },
        user: { connect: { id: Number(id) } },
      };
    } else if (bill.groupId) {
      const { groupId, ...rest } = bill;
      createBillInput = {
        ...rest,
        amount: Number(bill.amount),
        group: { connect: { id: Number(groupId) } },
        user: { connect: { id: Number(id) } },
      };
    } else {
      createBillInput = {
        ...bill,
        amount: Number(bill.amount),
        user: { connect: { id: Number(id) } },
      };
    }
    const createdBill = await this.billService.createBill({
      ...createBillInput,
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
      group: { connect: { id: Number(id) } },
    });
    return createdBill;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: BillEntity })
  @Put('/:id')
  async updateBill(
    @Param('id') id: string,
    @Body() bill: UpdateBillEntity,
  ): Promise<Bill> {
    const updatedBill = await this.billService.updateBill({
      where: { id: Number(id) },
      data: bill,
    });
    return updatedBill;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: BillEntity })
  @Put('/user/:id/bill/:billId')
  async updateBillByUser(
    @Param('id') id: string,
    @Param('billId') billId: string,
    @Body() bill: UpdateBillEntity,
  ): Promise<Bill> {
    let updateBillInput;
    if (bill.categoryId && bill.groupId) {
      const { categoryId, groupId, ...rest } = bill;
      updateBillInput = {
        ...rest,
        amount: Number(bill.amount),
        category: { connect: { id: Number(categoryId) } },
        group: { connect: { id: Number(groupId) } },
        user: { connect: { id: Number(id) } },
      };
    } else if (bill.categoryId) {
      const { categoryId, ...rest } = bill;
      updateBillInput = {
        ...rest,
        amount: Number(bill.amount),
        category: { connect: { id: Number(categoryId) } },
        user: { connect: { id: Number(id) } },
      };
    } else if (bill.groupId) {
      const { groupId, ...rest } = bill;
      updateBillInput = {
        ...rest,
        amount: Number(bill.amount),
        group: { connect: { id: Number(groupId) } },
        user: { connect: { id: Number(id) } },
      };
    } else {
      updateBillInput = {
        ...bill,
        amount: Number(bill.amount),
        user: { connect: { id: Number(id) } },
      };
    }
    const updatedBill = await this.billService.updateBill({
      where: { id: Number(billId) },
      data: updateBillInput,
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
