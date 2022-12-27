import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class UpdateCategoryEntity
  implements Partial<Prisma.CategoryCreateInput>
{
  @ApiProperty({ required: false })
  name: string;
}
