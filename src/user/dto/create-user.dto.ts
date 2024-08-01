import { IsNotEmpty, IsString, IsDateString, IsOptional, IsInt } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsInt()
    zodicSign: number; 

    @IsNotEmpty()
    @IsInt()
    gender: number; 

    @IsNotEmpty()
    @IsDateString()
    dateOfBirth: string;

    @IsNotEmpty()
    @IsString()
    timeOfBirth: string; 

    @IsOptional()
    @IsDateString()
    createdAt?: Date;
}

export class CreateGenderDto {
    @IsNotEmpty()
    @IsString()
    genderType: string;
}

export class CreateZodiacSignDto {
    @IsNotEmpty()
    @IsString()
    signName: string;
}