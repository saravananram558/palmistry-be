import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateSignupUserDto, CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("addUserDetails")
  addUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post("signUpDetails")
  signUpUser(@Body() CreateSignupUserDto: CreateSignupUserDto) {
    return this.userService.signUpUser(CreateSignupUserDto);
  }
}
