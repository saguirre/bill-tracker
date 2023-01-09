import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserProfileEntity {
  @ApiProperty({ required: false })
  avatar: string;
  @ApiProperty({ required: false })
  name: string;
  @ApiProperty({ required: false })
  phone: string;
}
