import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { PrismaService } from '../prisma.service';
import { InvitationProcessor } from './invitation.processor';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    BullModule.registerQueue({
      name: process.env.INVITATION_QUEUE,
    }),
  ],
  providers: [PrismaService, EmailService, InvitationProcessor],
})
export class InvitationModule {}
