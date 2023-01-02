import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class CreateGroupEntity implements Partial<Prisma.GroupCreateInput> {
  @ApiProperty()
  name: string;
  @ApiProperty()
  adminId: number;
  @ApiProperty({ required: false })
  members?: Prisma.UserCreateNestedManyWithoutGroupInput;
}
