export interface Bill {
  id?: string;
  name?: string;
  description?: string;
  amount?: number;
  dueDate: Date;
  paid?: boolean;
  paidDate?: Date;
  paidAmount?: number;
  paidBy?: string;
  paidTo?: string;
  paidVia?: string;
  paidNotes?: string;
  createdDate?: Date;
  modifiedDate?: Date;
  deletedDate?: Date;
  deleted?: boolean;
  deletedBy?: string;
  deletedReason?: string;
  createdBy?: string;
  modifiedBy?: string;
  tags?: string[];
  notes?: string;
  category?: string;
  subCategory?: string;
}
