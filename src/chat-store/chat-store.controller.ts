import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatStoreService } from './chat-store.service';
import { CreateChatStoreDto } from './dto/create-chat-store.dto';
import { UpdateChatStoreDto } from './dto/update-chat-store.dto';
import { ChatStore } from './entities/chat-store.entity';

@Controller('chat-store')
export class ChatStoreController {
  constructor(private readonly chatStoreService: ChatStoreService) {}

  @Post('save')
  async saveChat(@Body('from') from: string, @Body('content') content: string): Promise<ChatStore> {
    return this.chatStoreService.saveChat(from, content);
  }

  @Get('all')
  async getAllChats(): Promise<ChatStore[]> {
    return this.chatStoreService.getAllChats();
  }
}
