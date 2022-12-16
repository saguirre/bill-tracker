import { ApiProperty } from '@nestjs/swagger';
import { UserGroup } from '@prisma/client';

export class UserGroupEntity implements UserGroup {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
