import { ApiProperty } from '@nestjs/swagger';
import { Email } from './email.dto';

export class InvitationEmail extends Email {
  @ApiProperty({
    description: 'Invitation Email context data',
    example:
      '{ "adminName": "John Doe", "groupName": "Family", "url": "http://localhost:3000/join?token=JWT_TOKEN" }',
  })
  context?: { adminName: string; groupName: string; url: string };
}
