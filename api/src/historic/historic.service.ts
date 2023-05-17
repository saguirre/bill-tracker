import { Injectable } from '@nestjs/common';
import {
  HistoricBillsByCategory,
  HistoricBillsByMonth,
  HistoricBillsInMonth,
} from './entities/historic';
import { BillRepository } from 'src/bill/bill.repository';
import { CategoryRepository } from 'src/category/category.repository';

@Injectable()
export class HistoricService {
  constructor(
    private readonly billRepository: BillRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async historicBillsInMonth(params: {
    where: { userId: number };
  }): Promise<HistoricBillsInMonth> {
    const { where } = params;
    const a = this.billRepository.findMany({
      where: { userId: Number(where.userId) },
    });
    return a as any;
  }

  async historicBillsByMonth(params: {
    where: { userId: number };
  }): Promise<HistoricBillsByMonth> {
    const { where } = params;
    const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const allBills = await this.billRepository.findMany({
      where: { userId: Number(where.userId) },
    });
    const billsByMonth = months.map((month) => {
      const bills = allBills.filter((bill) => {
        const billDate = new Date(bill.dueDate);
        return billDate.getMonth() === month;
      });
      return {
        month,
        year: new Date().getFullYear(),
        total: bills.reduce((acc, bill) => acc + bill.amount, 0),
        bills,
      };
    });

    return { userId: Number(where.userId), billsByMonth };
  }

  async historicBillsByCategory(params: {
    where: { userId: number };
  }): Promise<HistoricBillsByCategory> {
    const { where } = params;
    const userCategories = await this.categoryRepository.findMany({
      where: { userId: Number(where.userId) },
    });

    const allBills = await this.billRepository.findMany({
      where: { userId: Number(where.userId) },
    });
    const billsByCategory = userCategories.map((category) => {
      const bills = allBills.filter((bill) => bill.categoryId === category.id);
      return {
        category,
        total: bills.reduce((acc, bill) => acc + bill.amount, 0),
        bills,
      };
    });

    return { userId: Number(where.userId), billsByCategory };
  }
}
