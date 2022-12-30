import { ApiProperty } from '@nestjs/swagger';
import { Group } from '@prisma/client';
import { BillEntity } from 'src/bill/entities/bill.entity';
import { NotificationEntity } from 'src/notification/entities/notification.entity';
import { UserEntity } from 'src/user/entities/user.entity';

export class GroupEntity implements Group {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  adminId: number;
  @ApiProperty()
  members: UserEntity[];
  @ApiProperty()
  bills: BillEntity[];
  @ApiProperty()
  notifications: NotificationEntity[];
  @ApiProperty()
  admin: UserEntity;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
