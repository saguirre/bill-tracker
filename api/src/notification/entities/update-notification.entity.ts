import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class UpdateNotificationEntity
  implements Partial<Prisma.NotificationUpdateInput>
{
  @ApiProperty({ required: false })
  read?: boolean;
}
