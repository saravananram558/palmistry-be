import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSignupUserDto, CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Gender, SignupDetails, UserDetails } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

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

   
    const existingUser = await this.signupDetailsRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('A user with this email already exists.');
    }
    
    const hashedPassword = await this.hashPassword(password);

    // Create a new user entity
    const newUser = this.signupDetailsRepository.create({
      userName: userName,
      email:email,
      mobileNumber:mobileNumber,
      password: hashedPassword,
    });

    return await this.signupDetailsRepository.save(newUser);
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
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
}
