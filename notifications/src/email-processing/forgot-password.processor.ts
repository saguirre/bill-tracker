/* eslint-disable prettier/prettier */
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { EmailService } from 'src/email/email.service';
import { PrismaService } from 'src/prisma.service';
import * as dotenv from 'dotenv';
dotenv.config();

@Processor(process.env.FORGOT_PASSWORD_QUEUE)
export class ForgotPasswordProcessor {
  private readonly logger = new Logger(ForgotPasswordProcessor.name);

  constructor(
    private readonly emailService: EmailService,
    private prisma: PrismaService,
  ) {}

  @Process(process.env.FORGOT_PASSWORD_JOB)
  async sendForgotPasswordEmail(job: Job) {
    try {
      this.logger.debug('Start sending forgot password email...');
      this.logger.debug(job.data);
      const model = {
        from: process.env.EMAIL_USER as string,
        to: job.data.email,
        subject: 'Reset your password',
        context: job.data.context,
      };
      const forgotPasswordEmail = await this.prisma.forgotPassword.create({
        data: {
          senderEmail: model.from,
          recipientEmail: model.to,
          subject: model.subject,
          context: JSON.stringify(model.context),
        },
      });

      const sendResult = await this.emailService.sendForgotPasswordEmail(model);
      if (sendResult.error) {
        this.logger.error('Error sending forgot password email');
        await this.prisma.forgotPassword.update({
          where: {
            id: forgotPasswordEmail.id,
          },
          data: {
            error: JSON.stringify(sendResult.error),
          },
        });
        return;
      }
      this.logger.debug('Forgot password email sent successfully');
      await this.prisma.forgotPassword.update({
        where: {
          id: forgotPasswordEmail.id,
        },
        data: {
          sent: true,
          sentAt: new Date(),
        },
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
