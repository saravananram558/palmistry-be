import { Module } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { OpenaiController } from './openai.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(), // Load environment variables from .env file
  ],
  controllers: [OpenaiController],
  providers: [OpenaiService,ConfigService],
})
export class OpenaiModule {}
