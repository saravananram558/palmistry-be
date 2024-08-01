import { Injectable } from '@nestjs/common';
import { CreateChatStoreDto } from './dto/create-chat-store.dto';
import { UpdateChatStoreDto } from './dto/update-chat-store.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatStore, Conversation } from './entities/chat-store.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatStoreService {
  constructor(
    @InjectRepository(ChatStore)
    private chatRepository: Repository<ChatStore>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>
  ) {}

  async saveChat(threadId: string, from: string, content: string, time: string): Promise<ChatStore> {
    const chat = this.chatRepository.create({ threadId, from, content, time });
    return this.chatRepository.save(chat);
  }

  async getChatHistory(threadId: string): Promise<ChatStore[]> {
    return this.chatRepository.find({ where: { threadId } });
  }

  async saveConversation(conversation: Conversation): Promise<Conversation> {
    return this.conversationRepository.save(conversation);
  }

  async getConversationsWithMessages(): Promise<Conversation[]> {
    return this.conversationRepository.createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.messages', 'message')
      .orderBy('conversation.createdAt', 'DESC')
      .getMany();
  }

}
