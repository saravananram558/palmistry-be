import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatStoreService } from './chat-store.service';
import { ChatStore, ConversationChat } from './entities/chat-store.entity';

@Controller('chat-store')
export class ChatStoreController {
  constructor(private readonly chatStoreService: ChatStoreService) {}

  @Post('save/:threadId')
  async saveChat(
    @Param('threadId') threadId: string,
    @Body() message: { from: string, content: string, time: string }
  ): Promise<ChatStore> {
    return this.chatStoreService.saveChat(threadId, message.from, message.content, message.time);
  }

  @Get('thread/:threadId')
  async getChatHistory(@Param('threadId') threadId: string): Promise<ChatStore[]> {
    return this.chatStoreService.getChatHistory(threadId);
  }

  @Get('conversations')
  async getConversations(): Promise<ConversationChat[]> {
    return this.chatStoreService.getConversationsWithMessages();
  }

  @Post('create-conversation')
  async createConversation(@Body('initialMessage') initialMessage: string) {
    const topic = this.extractTopic(initialMessage); // Function to determine topic
    const conversation = new ConversationChat();
    conversation.topic = topic;
    conversation.createdAt = new Date();
    // conversation.messages = [];

    await this.chatStoreService.saveConversation(conversation);

    return { conversationId: conversation.id, topic };
  }

  private extractTopic(initialMessage: string): string {
    // Logic to determine the topic, e.g., based on keywords or first sentence
    return initialMessage.split(' ').slice(0, 5).join(' '); // First 5 words as topic
  }

}
