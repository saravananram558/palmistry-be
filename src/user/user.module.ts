import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Gender, SignupDetails, UserDetails } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationChat } from 'src/chat-store/entities/chat-store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserDetails, Gender, SignupDetails])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
