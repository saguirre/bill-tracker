import { Bill } from '../bill/bill';
import { CategoryModel } from '../category';

export interface BillByCategory {
  category: CategoryModel;
  total: number;
  bills: Bill[];
}

export interface HistoricBillsByCategory {
  userId: number;
  billsByCategory: BillByCategory[];
}
