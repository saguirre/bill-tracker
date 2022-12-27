import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryEntity {
  @ApiProperty()
  name: string;
}
