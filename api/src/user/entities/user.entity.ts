import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class UserEntity implements Partial<User> {
  @ApiProperty()
  id: number;
  @ApiProperty()
  email: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  avatar: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  countryCode: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  activated: boolean;
  @ApiProperty()
  notifications?: boolean;
  @ApiProperty()
  inAppNotifications?: boolean;
  @ApiProperty()
  emailNotifications?: boolean;
  @ApiProperty()
  smsNotifications?: boolean;
  @ApiProperty()
  usageStatistics?: boolean;
  @ApiProperty()
  userGroupId: number;
}
