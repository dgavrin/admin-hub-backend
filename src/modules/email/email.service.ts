import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from 'src/core/config/config.service';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  constructor(private readonly configService: ConfigService) {}

  public async sendVerificationEmail(email: string, verificationToken: string) {
    const verificationUrl =
      `${this.configService.clientUrl}/api/auth/verify-email` +
      `?token=${encodeURIComponent(verificationToken)}`;

    try {
      const response = await fetch(
        `${this.configService.clientUrl}/api/auth/send-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, verificationUrl }),
        },
      );

      let responseBody: { success?: boolean; message?: string } | null = null;
      try {
        responseBody = (await response.json()) as {
          success?: boolean;
          message?: string;
        };
      } catch {
        responseBody = null;
      }

      const isSuccessful = response.ok && responseBody?.success !== false;
      if (!isSuccessful) {
        throw new Error(
          responseBody?.message ??
            `Email gateway returned status ${response.status}`,
        );
      }

      this.logger.log(`Verification email sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Error sending verification email to ${email}: ${error}`,
      );
      throw error;
    }
  }
}
