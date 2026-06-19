import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private readonly configService: NestConfigService) {}

  private getEnv<T>(key: string): T {
    const value = this.configService.get<T>(key);
    if (!value) {
      throw new Error(`${key} is not set`);
    }

    return value;
  }

  public get databaseUrl(): string {
    return this.getEnv<string>('DATABASE_URL');
  }

  // JWT Configuration
  public get jwtAccessSecret(): string {
    return this.getEnv<string>('JWT_ACCESS_SECRET');
  }

  public get jwtRefreshSecret(): string {
    return this.getEnv<string>('JWT_REFRESH_SECRET');
  }

  /**
   * Access token expiration in seconds (default: 3600 = 60 minutes)
   */
  public get jwtAccessExpiresIn(): number {
    return this.getEnv<number>('JWT_ACCESS_EXPIRES_IN');
  }

  /**
   * Refresh token expiration in seconds (default: 2592000 = 30 days)
   */
  public get jwtRefreshExpiresIn(): number {
    return this.getEnv<number>('JWT_REFRESH_EXPIRES_IN');
  }

  public get gmailUser(): string {
    return this.getEnv<string>('GMAIL_USER');
  }

  public get gmailAppPassword(): string {
    return this.getEnv<string>('GMAIL_APP_PASSWORD');
  }

  public get mailFromName(): string {
    return this.getEnv<string>('MAIL_FROM_NAME');
  }

  public get clientUrl(): string {
    return this.getEnv<string>('CLIENT_URL');
  }
}
