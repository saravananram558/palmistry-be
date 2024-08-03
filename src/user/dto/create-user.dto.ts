import { IsNotEmpty, IsString, IsDateString, IsNumber, IsEmail } from 'class-validator';

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

export class LoginDto {
  email: string;
  password: string;
}

export class GoogleLoginDto {
  @IsEmail()
  email: string;

  @IsString()
  displayName: string;
}
