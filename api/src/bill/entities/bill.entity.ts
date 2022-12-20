import { ApiProperty } from '@nestjs/swagger';
import { Bill } from '@prisma/client';

export class BillEntity implements Bill {
  @ApiProperty()
  id: number;
  @ApiProperty()
  title: string;
  @ApiProperty()
  amount: number;
  @ApiProperty()
  paid: boolean;
  @ApiProperty()
  paidDate: Date | null;
  @ApiProperty()
  userId: number;
  @ApiProperty()
  dueDate: Date;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  userGroupId: number;
}
