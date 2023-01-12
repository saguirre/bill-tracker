import { ApiProperty } from '@nestjs/swagger';
import { Email } from './email.dto';

export class ForgotPasswordEmail extends Email {
  @ApiProperty({
    description: 'Forgot Password Email context data',
    example:
      '{ "name": "John Doe", "url": "http://localhost:3000/forgot-password?token=JWT_TOKEN" }',
  })
  context?: { name: string; url: string };
}
