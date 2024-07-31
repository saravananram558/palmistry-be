import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenaiModule } from './openai/openai.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [OpenaiModule,
     ServeStaticModule.forRoot({
      rootPath: join('/home/finstein-emp/Documents/palmistory-BE/palmistry-be', 'uploads'),
  }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
