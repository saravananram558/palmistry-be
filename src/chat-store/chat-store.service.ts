import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatStore, ConversationChat } from './entities/chat-store.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatStoreService {
  constructor(
    @InjectRepository(ChatStore)
    private chatRepository: Repository<ChatStore>,
    @InjectRepository(ConversationChat)
    private readonly conversationRepository: Repository<ConversationChat>
  ) {}

  async saveChat(threadId: string, from: string, content: string, time: string): Promise<ChatStore> {
    const chat = this.chatRepository.create({ threadId, from, content, time });
    return this.chatRepository.save(chat);
  }

  async getChatHistory(threadId: string): Promise<ChatStore[]> {
    return this.chatRepository.find({ where: { threadId } });
  }

  async saveConversation(conversation: ConversationChat): Promise<ConversationChat> {
    return this.conversationRepository.save(conversation);
  }

  async getConversationsWithMessages(): Promise<ConversationChat[]> {
    return this.conversationRepository.createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.messages', 'message')
      .orderBy('conversation.createdAt', 'DESC')
      .getMany();
  }

}
