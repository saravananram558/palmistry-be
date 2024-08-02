import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Gender, UserDetails } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserDetails, Gender])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
