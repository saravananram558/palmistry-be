import { Module } from '@nestjs/common';
import { ChatStoreService } from './chat-store.service';
import { ChatStoreController } from './chat-store.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatStore, Conversation } from './entities/chat-store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatStore, Conversation])],
  controllers: [ChatStoreController],
  providers: [ChatStoreService],
})
export class ChatStoreModule {}
