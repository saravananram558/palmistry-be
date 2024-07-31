import { PartialType } from '@nestjs/swagger';
import { CreateChatStoreDto } from './create-chat-store.dto';

export class UpdateChatStoreDto extends PartialType(CreateChatStoreDto) {}
