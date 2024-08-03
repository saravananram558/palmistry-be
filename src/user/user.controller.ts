import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateSignupUserDto, CreateUserDto, GoogleLoginDto, LoginDto } from './dto/create-user.dto';
import { UserDetails } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('addUserDetails')
  async addUser(@Body() createUserDto: CreateUserDto): Promise<UserDetails> {
    if (createUserDto.userId) {
      return this.userService.updateUserDetails(createUserDto.userId, createUserDto);
    } else {
      return this.userService.createUserDetails(createUserDto);
    }
  }

  @Post('signUpDetails')
  async signUpUser(
    @Body() createSignupUserDto: CreateSignupUserDto,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const result = await this.userService.signUpUser(createSignupUserDto);
      return { success: true, message: 'User registered successfully.' };
    } catch (error) {
      // Handle specific errors
      if (error.message === 'A user with this email already exists.') {
        return {
          success: false,
          message: 'A user with this email already exists.',
        };
      }
      // Handle other potential errors
      return {
        success: false,
        message: 'An error occurred during registration.',
      };
    }
  }

  @Post('login')
  async loginUser(@Body() loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;

    try {
      const result = await this.userService.loginUser(email, password);
      return { success: true, ...result };
    } catch (error) {
      // Handle errors
      return {
        success: false,
        message: error.message || 'An error occurred during login.',
      };
    }
  }

  @Post('google-login')
  async googleLogin(@Body() googleLoginDto: GoogleLoginDto): Promise<any> {
    try {
      const result = await this.userService.googleLogin(googleLoginDto);
      return { success: true, ...result };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'An error occurred during Google login.',
      };
    }
  }


  @Get('profileDetails/:id')
  async getProfileDetails(@Param('id') id: number): Promise<UserDetails> {
    return this.userService.getProfileDetails(id);
  }
  
}
