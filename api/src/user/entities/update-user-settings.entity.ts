import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserSettingsEntity {
  @ApiProperty({ required: false })
  notifications: boolean;
  @ApiProperty({ required: false })
  inAppNotifications: boolean;
  @ApiProperty({ required: false })
  emailNotifications: boolean;
  @ApiProperty({ required: false })
  smsNotifications: boolean;
  @ApiProperty({ required: false })
  usageStatistics: boolean;
}
