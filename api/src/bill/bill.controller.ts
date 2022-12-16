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
import { Bill, Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BillService } from './bill.service';

@Controller('bill')
export class BillController {
  constructor(private readonly billService: BillService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getUserById(@Param('id') id: string): Promise<Partial<Bill>> {
    const bill = await this.billService.bill({ id: Number(id) });
    return bill;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getBills(): Promise<Bill[]> {
    const bills = await this.billService.bills({});
    return bills;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user/:id')
  async getBillsByUserId(@Param('id') id: string): Promise<Bill[]> {
    const bills = await this.billService.bills({
      where: { userId: Number(id) },
    });
    return bills;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/group/:id')
  async getBillsByGroupId(@Param('id') id: string): Promise<Bill[]> {
    const bills = await this.billService.bills({
      where: { userGroupId: Number(id) },
    });
    return bills;
  }

  @UseGuards(JwtAuthGuard)
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
  @Post()
  async createBill(@Body() bill: Prisma.BillCreateInput): Promise<Bill> {
    const createdBill = await this.billService.createBill(bill);
    return createdBill;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/group/:id')
  async createBillByGroupId(
    @Param('id') id: string,
    @Body() bill: Prisma.BillCreateInput,
  ): Promise<Bill> {
    const createdBill = await this.billService.createBill({
      ...bill,
      userGroup: { connect: { id: Number(id) } },
    });
    return createdBill;
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async updateBill(
    @Param('id') id: string,
    @Body() bill: Prisma.BillUpdateInput,
  ): Promise<Bill> {
    const updatedBill = await this.billService.updateBill({
      where: { id: Number(id) },
      data: bill,
    });
    return updatedBill;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteBill(@Param('id') id: string): Promise<Bill> {
    const deletedBill = await this.billService.deleteBill({
      id: Number(id),
    });
    return deletedBill;
  }
}
