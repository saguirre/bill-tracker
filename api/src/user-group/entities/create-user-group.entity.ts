import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class CreateUserGroupEntity implements Prisma.UserGroupCreateInput {
  @ApiProperty()
  name: string;
}
