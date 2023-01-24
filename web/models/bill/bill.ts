import { CategoryModel } from '../category';

export interface Bill {
  id?: number;
  title?: string;
  amount?: number;
  paid?: boolean;
  userId?: number;
  group?: { id: number; name: string };
  category?: CategoryModel;
  dueDate?: string | null;
  paidDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
  userGroupId?: number;
}
