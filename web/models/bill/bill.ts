import { CategoryModel } from '../category';

export interface Bill {
  id?: number;
  title?: string;
  amount?: number;
  paid?: boolean;
  userId?: number;
  group?: { id: number; name: string };
  category?: CategoryModel;
  categoryId?: number;
  dueDate?: string;
  paidDate?: string;
  createdAt?: string;
  updatedAt?: string;
  userGroupId?: number;
}
