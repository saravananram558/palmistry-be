import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateSignupUserDto, CreateUserDto, GoogleLoginDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Gender, SignupDetails, UserDetails } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(SignupDetails)
    private readonly signupDetailsRepository: Repository<SignupDetails>,
    @InjectRepository(UserDetails)
    private readonly userDetailsRepository: Repository<UserDetails>,
    @InjectRepository(Gender)
    private readonly genderRepository: Repository<Gender>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDetails> {
    const dateOfBirth = createUserDto.dateOfBirth;

    // Debug: Log the received dateOfBirth value
    console.log('Received dateOfBirth:', dateOfBirth);
  
    // Validate the date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) {
      throw new Error('Invalid dateOfBirth format');
    }
  
    // Parse the date
    const date = new Date(dateOfBirth);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid dateOfBirth value');
    }
  
    const timeOfBirth: string = createUserDto.timeOfBirth;
    if (!/^\d{2}:\d{2}:\d{2}$/.test(timeOfBirth)) {
      throw new Error('Invalid timeOfBirth format');
    }
    const userDetails = this.userDetailsRepository.create({
      name: createUserDto.name,
      zodiacSign: createUserDto.zodiacSign,
      gender: createUserDto.gender,
      dateOfBirth: dateOfBirth,
      timeOfBirth: timeOfBirth,
    });
  
    return await this.userDetailsRepository.save(userDetails);
  }

  async signUpUser(createSignupUserDto: CreateSignupUserDto): Promise<SignupDetails> {
    const { userName, email, mobileNumber, password } = createSignupUserDto;
  
    // Check if the user already exists
    const existingUser = await this.signupDetailsRepository.findOne({ where: { email } });
    if (existingUser) {
      // Throw a specific error to be caught by the controller
      throw new Error('A user with this email already exists.');
    }
  
    // Hash the password and create a new user
    const hashedPassword = await this.hashPassword(password);
    const newUser = this.signupDetailsRepository.create({
      userName: userName,
      email: email,
      mobileNumber: mobileNumber,
      password: hashedPassword,
    });
  
    return await this.signupDetailsRepository.save(newUser);
  }
  
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async findUserByEmail(email: string): Promise<SignupDetails | null> {
    return this.signupDetailsRepository.findOne({ where: { email } });
  }

  async verifyPassword(user: SignupDetails, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  async loginUser(email: string, password: string): Promise<any> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await this.verifyPassword(user, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const token = this.generateJwtToken(user);

    return { success: true, message: 'Login successfully', userId: user.id, token: token };
  }

  async googleLogin(googleLoginDto: GoogleLoginDto): Promise<any> {
    const { email, displayName } = googleLoginDto;
    let user = await this.findUserByEmail(email);
    if (!user) {
      user = this.signupDetailsRepository.create({
        email,
        userName: displayName,
        mobileNumber: '', 
        password: '',
        provider: 'google',
      });
      await this.signupDetailsRepository.save(user);
    } else {
      user.userName = displayName;
      user.provider = 'google';
      await this.signupDetailsRepository.save(user);
    }
    const token = this.generateJwtToken(user);
    return { message: 'Google login successful', userId: user.id, token };
  }

  private generateJwtToken(user: SignupDetails): string {
    const payload = { email: user.email, userId: user.id };
    return jwt.sign(payload, 'your-secret-key', { expiresIn: '1h' }); // Adjust the secret key and expiration time
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserDetails> {
    // Fetch the existing user
    const existingUser = await this.userDetailsRepository.findOneBy({ id });
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // If `gender` is being updated, fetch the corresponding Gender entity
    let gender: Gender | undefined;
    if (updateUserDto.gender) {
      gender = await this.genderRepository.findOneBy({ id: updateUserDto.gender });
      if (!gender) {
        throw new NotFoundException('Gender not found');
      }
    }

    // Prepare updated entity
    const updatedUserDetails = {
      ...existingUser,
      ...updateUserDto,
      gender: gender || existingUser.gender, // Use the fetched gender if available
    };

    // Save the updated UserDetails instance
    // await this.userDetailsRepository.update(id, updatedUserDetails);

    // Return the updated user
    return await this.userDetailsRepository.findOneBy({ id });
  }

  async findAll(): Promise<UserDetails[]> {
    return await this.userDetailsRepository.find();
  }

  async findOne(id: number): Promise<UserDetails> {
    const user = await this.userDetailsRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async remove(id: number): Promise<void> {
    const result = await this.userDetailsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async getProfileDetails(userId: number): Promise<UserDetails> {
    const user = await this.userDetailsRepository.findOneBy({ id:userId });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }else{
      let userData = await this.userDetailsRepository.createQueryBuilder('ud')
      .leftJoin(Gender,'g','ud.gender = g.id')
      .select('ud.id as id, ud.gender as gender, ud.name as userName, ud.dateOfBirth as dateOfBirth, ud.timeOfBirth as timeOfBirth')
      .getRawOne();
      if (userData.timeOfBirth) {
        const timeParts = userData.timeOfBirth.split(':');
        userData.timeOfBirth = `${timeParts[0]}:${timeParts[1]}`;
      }  
      return userData;
    }
  }
}
