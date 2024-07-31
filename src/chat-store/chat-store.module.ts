import { Module } from '@nestjs/common';
import { ChatStoreService } from './chat-store.service';
import { ChatStoreController } from './chat-store.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatStore } from './entities/chat-store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatStore])],
  controllers: [ChatStoreController],
  providers: [ChatStoreService],
})
export class ChatStoreModule {}
