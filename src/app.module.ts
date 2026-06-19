import { Module } from '@nestjs/common';
import { ConfigModule } from './core/config/config.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './core/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [ConfigModule, PrismaModule, AuthModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
