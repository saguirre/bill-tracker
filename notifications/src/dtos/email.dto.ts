import { ApiProperty } from '@nestjs/swagger';

export class Email {
  @ApiProperty({
    description: 'Email address',
    example: 'email@emailhost.com',
  })
  to: string;
  @ApiProperty({
    description: 'Email address',
    example: 'email@emailhost.com',
  })
  from: string;
  @ApiProperty({
    description: 'Email subject',
    example: 'Email subject',
  })
  subject: string;
  @ApiProperty({
    description: 'Email body',
    example: 'Email body',
  })
  text?: string;
  @ApiProperty({
    description: 'Email html body',
    example: 'Email html',
  })
  html?: string;
  @ApiProperty({
    description: 'Email template',
    example: 'Email template',
  })
  template?: string;
  @ApiProperty({
    description: 'Email attachments',
    example: '[{ filename: "text1.txt", content: "hello world!" }]',
  })
  attachments?: any;
  @ApiProperty({
    description: 'Email headers',
    example: '{ "X-Laziness-level": 1000 }',
  })
  headers?: any;
  @ApiProperty({
    description: 'Email options',
    example: '{ "priority": "high" }',
  })
  options?: any;
}
