export interface Bill {
  id?: number;
  title?: string;
  amount?: number;
  paid?: boolean;
  userId?: number;
  dueDate?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  userGroupId?: number;
}
