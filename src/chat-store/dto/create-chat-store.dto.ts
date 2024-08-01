import { IsString, IsNotEmpty } from 'class-validator';

export class CreateChatStoreDto {
  @IsString()
  @IsNotEmpty()
  threadId: string;

  @IsString()
  @IsNotEmpty()
  from: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  time: string;
}
