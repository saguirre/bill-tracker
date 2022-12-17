import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class CreateBillEntity implements Partial<Prisma.BillCreateInput> {
  @ApiProperty()
  title: string;
  @ApiProperty()
  amount: number;
  @ApiProperty({ required: false })
  paid?: boolean;
  @ApiProperty({ required: false })
  dueDate?: string | Date;
  @ApiProperty({ required: false })
  createdAt?: string | Date;
  @ApiProperty({ required: false })
  updatedAt?: string | Date;
  @ApiProperty({ required: false })
  file?: Prisma.FileCreateNestedManyWithoutBillInput;
}
