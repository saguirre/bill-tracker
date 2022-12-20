import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class UpdateBillEntity implements Partial<Prisma.BillUpdateInput> {
  @ApiProperty({ required: false })
  title?: string;
  @ApiProperty({ required: false })
  amount?: number;
  @ApiProperty({ required: false })
  paid?: boolean;
  @ApiProperty({ required: false })
  dueDate?: string | Date;
  @ApiProperty({ required: false })
  paidDate?: string | Date;
  @ApiProperty({ required: false })
  createdAt?: string | Date;
  @ApiProperty({ required: false })
  updatedAt?: string | Date;
  @ApiProperty({ required: false })
  file?: Prisma.FileCreateNestedManyWithoutBillInput;
}
