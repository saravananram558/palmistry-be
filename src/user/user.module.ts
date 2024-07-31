import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Gender, UserDetails, ZodicSign } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserDetails, ZodicSign, Gender])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
