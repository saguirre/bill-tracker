import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class CreateNotificationEntity
  implements Partial<Prisma.NotificationCreateInput>
{
  @ApiProperty()
  title: string;
  @ApiProperty()
  message: string;
}
