import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private readonly configService: NestConfigService) {}

  public get databaseUrl(): string {
    const databaseUrl = this.configService.get<string>('DATABASE_URL');
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not set');
    }
    return databaseUrl;
  }

  // JWT Configuration
  public get jwtAccessSecret(): string {
    const secret = this.configService.get<string>('JWT_ACCESS_SECRET');
    if (!secret) {
      throw new Error('JWT_ACCESS_SECRET is not set');
    }
    return secret;
  }

  public get jwtRefreshSecret(): string {
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET');
    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET is not set');
    }
    return secret;
  }

  /**
   * Access token expiration in seconds (default: 3600 = 60 minutes)
   */
  public get jwtAccessExpiresIn(): number {
    const value = this.configService.get<number>('JWT_ACCESS_EXPIRES_IN');
    return value || 3600; // 60 minutes
  }

  /**
   * Refresh token expiration in seconds (default: 2592000 = 30 days)
   */
  public get jwtRefreshExpiresIn(): number {
    const value = this.configService.get<number>('JWT_REFRESH_EXPIRES_IN');
    return value || 2592000; // 30 days
  }
}
