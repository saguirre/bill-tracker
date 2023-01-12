import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { PrismaService } from '../prisma.service';
import { InvitationProcessor } from './invitation.processor';
import * as dotenv from 'dotenv';
import { ActivationProcessor } from './activation.processor';
import { ForgotPasswordProcessor } from './forgot-password.processor';
dotenv.config();

@Module({
  imports: [
    BullModule.registerQueue({
      name: process.env.INVITATION_QUEUE,
    }),
    BullModule.registerQueue({
      name: process.env.ACTIVATION_QUEUE,
    }),
    BullModule.registerQueue({
      name: process.env.FORGOT_PASSWORD_QUEUE,
    }),
  ],
  providers: [
    PrismaService,
    EmailService,
    InvitationProcessor,
    ActivationProcessor,
    ForgotPasswordProcessor,
  ],
})
export class EmailProcessingModule {}
