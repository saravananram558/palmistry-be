import { IsNotEmpty, IsString, IsDateString, IsNumber } from 'class-validator';

export class CreateUserDto {
    name: string;
    zodiacSign: string;
    gender: number;  // This will be an ID, which you will use to fetch the `Gender` entity
    dateOfBirth: string;
    timeOfBirth: string;
  }

export class CreateGenderDto {
    @IsNotEmpty()
    @IsString()
    genderType: string;
}

export class CreateSignupUserDto {
  userName: string;
  email: string;
  mobileNumber: string;
  password: string;
}