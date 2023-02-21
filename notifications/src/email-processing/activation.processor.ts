/* eslint-disable prettier/prettier */
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { EmailService } from 'src/email/email.service';
import { PrismaService } from 'src/prisma.service';
import * as dotenv from 'dotenv';
dotenv.config();

@Processor(process.env.ACTIVATION_QUEUE)
export class ActivationProcessor {
  private readonly logger = new Logger(ActivationProcessor.name);

  constructor(
    private readonly emailService: EmailService,
    private prisma: PrismaService,
  ) {}

  @Process(process.env.ACTIVATION_JOB)
  async sendActivationEmail(job: Job) {
    try {
      this.logger.debug('Start sending activation email...');
      this.logger.debug(job.data);
      const model = {
        from: process.env.EMAIL_USER as string,
        to: job.data.email,
        subject: 'Activate your account',
        context: job.data.context,
      };
      const activationEmail = await this.prisma.activation.create({
        data: {
          senderEmail: model.from,
          recipientEmail: model.to,
          subject: model.subject,
          context: JSON.stringify(model.context),
        },
      });

      const sendResult = await this.emailService.sendActivationEmail(model);
      if (sendResult.error) {
        this.logger.error('Error sending activation email');
        await this.prisma.activation.update({
          where: {
            id: activationEmail.id,
          },
          data: {
            error: JSON.stringify(sendResult.error),
          },
        });
        return;
      }
      this.logger.debug('Activation email sent successfully');
      await this.prisma.activation.update({
        where: {
          id: activationEmail.id,
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
