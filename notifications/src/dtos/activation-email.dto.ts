import { ApiProperty } from '@nestjs/swagger';
import { Email } from './email.dto';

export class ActivationEmail extends Email {
  @ApiProperty({
    description: 'Activation Email context data',
    example:
      '{ "name": "John Doe", "url": "http://localhost:3000/activate-account?token=JWT_TOKEN" }',
  })
  context?: { name: string; url: string };
}
