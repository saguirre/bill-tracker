export interface Notification {
  message: string;
  deleted: boolean;
  groupId: number;
  id: number;
  title: string;
  description: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
}
