export interface AddBill {
  title?: string;
  amount?: number;
  paid?: boolean;
  dueDate?: Date | null;
}
