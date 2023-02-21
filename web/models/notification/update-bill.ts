export interface UpdateBill {
  title?: string;
  amount?: number;
  paid?: boolean;
  dueDate?: Date | null;
}
