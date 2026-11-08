import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { ContactType, RequestType } from '../entities/contact-us.entity';

export class CreateContactUsDto {
  @ApiProperty({ description: 'Full name of the person making contact' })
  @IsString()
  @Length(1, 255)
  fullname: string;

  @ApiProperty({ description: 'Email address of the contact' })
  @IsEmail()
  @Length(5, 255)
  email: string;

  @ApiProperty({ description: 'Phone number of the contact' })
  @IsString()
  @Length(5, 50)
  phone_number: string;

  @ApiProperty({ 
    description: 'Type of contact - CENTER or RADIOLOGIST', 
    enum: ContactType,
    enumName: 'ContactType'
  })
  @IsEnum(ContactType)
  contactType: ContactType;

  @ApiProperty({ 
    description: 'Type of request - DEMO or QUERY', 
    enum: RequestType,
    enumName: 'RequestType'
  })
  @IsEnum(RequestType)
  requestType: RequestType;

  @ApiProperty({ 
    description: 'Contact message content',
    required: false 
  })
  @IsOptional()
  @IsString()
  message?: string;
}
