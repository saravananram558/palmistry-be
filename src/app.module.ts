import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenaiModule } from './openai/openai.module';
import { ChatStoreModule } from './chat-store/chat-store.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatStore } from './chat-store/entities/chat-store.entity';
import { UserModule } from './user/user.module';
import { Gender, UserDetails, ZodicSign } from './user/entities/user.entity';

@Module({
  imports: [OpenaiModule, ChatStoreModule,
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      // synchronize: true,
      entities:[ChatStore, UserDetails, Gender, ZodicSign]
    }),
    UserModule,
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
