import { ApiProperty } from '@nestjs/swagger';
import { Bill, Category } from '@prisma/client';

export class BillByMonth {
  @ApiProperty()
  month: number;
  @ApiProperty()
  year: number;
  @ApiProperty()
  total: number;
  @ApiProperty()
  bills: Bill[];
}

export class BillByCategory {
  @ApiProperty()
  category: Category;
  @ApiProperty()
  bills: Bill[];
}

export class HistoricBillsInMonth {
  @ApiProperty()
  userId: number;
  @ApiProperty()
  userGroupId: number;
  @ApiProperty()
  month: number;
  @ApiProperty()
  year: number;
  @ApiProperty()
  total: number;
  @ApiProperty()
  billsInMonth: Bill[];
}

export class HistoricBillsByMonth {
  @ApiProperty()
  userId: number;
  @ApiProperty({ required: false })
  userGroupId?: number;
  @ApiProperty()
  billsByMonth: BillByMonth[];
}

export class HistoricBillsByCategory {
  @ApiProperty()
  userId: number;
  @ApiProperty()
  billsByCategory: BillByCategory[];
}
