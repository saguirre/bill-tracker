import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class UpdateGroupEntity implements Partial<Prisma.GroupUpdateInput> {
  @ApiProperty({ required: false })
  name?: string;
  @ApiProperty({ required: false })
  admin?: Prisma.UserUpdateOneRequiredWithoutGroupsNestedInput;
  @ApiProperty({ required: false })
  members?: Prisma.UserUpdateManyWithoutGroupNestedInput;
}
