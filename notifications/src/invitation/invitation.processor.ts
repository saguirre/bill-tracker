/* eslint-disable prettier/prettier */
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { EmailService } from 'src/email/email.service';
import { PrismaService } from 'src/prisma.service';
import * as dotenv from 'dotenv';
dotenv.config();

@Processor(process.env.INVITATION_QUEUE)
export class InvitationProcessor {
  private readonly logger = new Logger(InvitationProcessor.name);

  constructor(
    private readonly emailService: EmailService,
    private prisma: PrismaService,
  ) {}

  @Process(process.env.INVITATION_JOB)
  async sendInvitationEmail(job: Job) {
    try {
      this.logger.debug('Start sending invitation email...');
      Logger.log(`Queue string`, process.env.REPORT_NOTIFICATION_QUEUE as string);
      Logger.log(`Job string`, process.env.REPORT_NOTIFICATION_JOB as string);
      Logger.log(`Redis host`, process.env.REDIS_HOST as string);
      Logger.log(`Redis port`, process.env.REDIS_PORT as string);
  
      this.logger.debug(job.data);
      const model = {
        from: process.env.EMAIL_USER as string,
        to: job.data.to,
        subject: job.data.subject,
        context: job.data.context,
      };
      const invitationEmail = await this.prisma.invitation.create({
        data: {
          senderEmail: model.from,
          recipientEmail: model.to,
          subject: model.subject,
          context: JSON.stringify(model.context),
        },
      });

      const sendResult = await this.emailService.sendUserInvitation(model);
      if (sendResult.error) {
        this.logger.error('Error sending invitation email');
        await this.prisma.invitation.update({
          where: {
            id: invitationEmail.id,
          },
          data: {
            error: JSON.stringify(sendResult.error),
          },
        });
        return;
      }
      this.logger.debug('Invitation email sent successfully');
      await this.prisma.invitation.update({
        where: {
          id: invitationEmail.id,
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
