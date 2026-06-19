import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from 'src/core/config/config.service';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.gmailUser,
        pass: this.configService.gmailAppPassword,
      },
    });
  }

  public async sendVerificationEmail(email: string, verificationToken: string) {
    const fromName = this.configService.mailFromName;
    const verificationUrl =
      `${this.configService.clientUrl}/api/auth/verify-email` +
      `?token=${encodeURIComponent(verificationToken)}`;

    const mail = {
      from: `"${fromName}" <${this.configService.gmailUser}>`,
      to: email,
      subject: 'Verify your email',
      html: `
        <p>Welcome to Admin Hub.</p>
        <p>Please verify your email by clicking the link below:</p>
        <p><a href="${verificationUrl}">${verificationUrl}</a></p>
      `,
      text: `Verify your email: ${verificationUrl}`,
    };

    try {
      await this.transporter.sendMail(mail);
      this.logger.log(`Verification email sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Error sending verification email to ${email}: ${error}`,
      );
      throw error;
    }
  }
}
