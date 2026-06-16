import { Module } from '@nestjs/common';
import { ConfigModule } from './core/config/config.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './core/prisma/prisma.module';

@Module({
  imports: [ConfigModule, PrismaModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
