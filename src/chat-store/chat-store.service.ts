import { Injectable } from '@nestjs/common';
import { CreateChatStoreDto } from './dto/create-chat-store.dto';
import { UpdateChatStoreDto } from './dto/update-chat-store.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatStore } from './entities/chat-store.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatStoreService {

  constructor(
    @InjectRepository(ChatStore)
    private chatRepository: Repository<ChatStore>,
  ) {}
  
  async saveChat(from: string, content: string): Promise<ChatStore> {
    const chat = this.chatRepository.create({ from, content });
    return this.chatRepository.save(chat);
  }

  async getAllChats(): Promise<ChatStore[]> {
    return this.chatRepository.find();
  }
}
