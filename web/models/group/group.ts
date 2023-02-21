import { Bill } from '../bill/bill';
import { User } from '../user/user';
import { GroupInvite } from './group-invite';
import { Member } from './member';

export interface Group {
  id?: number;
  name?: string;
  members?: Member[];
  bills?: Bill[];
  groupInvite?: GroupInvite[];
  admin?: User;
  adminId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
