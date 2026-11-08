import { IsNotEmpty, IsString, IsInt, IsEmail, Min, Max, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../../common/enums/gender.enum';

export class CreatePatientDto {
  @ApiProperty({
    description: 'Center ID that the patient belongs to',
    example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
  })
  @IsNotEmpty()
  @IsString()
  centerId: string;
  
  @ApiProperty({
    description: 'Name of the patient',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Age of the patient',
    example: 35,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(150)
  age: number;

  @ApiProperty({
    description: 'Gender of the patient',
    example: Gender.MALE,
    enum: Gender,
  })
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    description: 'Phone number of the patient',
    example: '9876543210',
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    description: 'Email address of the patient',
    example: 'johndoe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
