import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class CreateGroupEntity implements Prisma.GroupCreateInput {
  @ApiProperty()
  name: string;
  @ApiProperty()
  admin: Prisma.UserCreateNestedOneWithoutGroupsInput;
  @ApiProperty()
  members: Prisma.UserCreateNestedManyWithoutGroupInput;
}
