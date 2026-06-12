import { Module } from '@nestjs/common';
import { ConfigModule } from './core/config/config.module';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
