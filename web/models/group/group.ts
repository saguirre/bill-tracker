import { User } from '../user/user';

export interface Group {
  id?: number;
  name?: string;
  users?: User[];
  admin?: User;
  createdAt?: Date;
  updatedAt?: Date;
}
