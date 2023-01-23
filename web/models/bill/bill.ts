import { CategoryModel } from '../category';

export interface Bill {
  id?: number;
  title?: string;
  amount?: number;
  paid?: boolean;
  userId?: number;
  group?: { id: number; name: string };
  category?: CategoryModel;
  dueDate?: Date | null;
  paidDate?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  userGroupId?: number;
}
