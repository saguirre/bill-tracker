import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { ActivationEmail } from 'src/dtos/activation-email.dto';
import { InvitationEmail } from 'src/dtos/invitation-email.dto';
dotenv.config();

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendUserInvitation(invitationEmail: InvitationEmail): Promise<any> {
    try {
      return await this.mailerService.sendMail({
        to: invitationEmail.to,
        subject: invitationEmail.subject,
        template: './invitation',
        context: invitationEmail.context,
      });
    } catch (error) {
      console.error(error);
      return { error };
    }
  }

  async sendActivationEmail(activationEmail: ActivationEmail): Promise<any> {
    try {
      return await this.mailerService.sendMail({
        to: activationEmail.to,
        subject: activationEmail.subject,
        template: './activation',
        context: activationEmail.context,
      });
    } catch (error) {
      console.error(error);
      return { error };
    }
  }
}
