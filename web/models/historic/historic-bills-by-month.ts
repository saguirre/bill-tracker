import { Bill } from '../bill/bill';

export interface BillByMonth {
  month: number;
  year: number;
  total: number;
  bills: Bill[];
}

export interface HistoricBillsByMonth {
  userId: number;
  userGroupId?: number;
  billsByMonth: BillByMonth[];
}
