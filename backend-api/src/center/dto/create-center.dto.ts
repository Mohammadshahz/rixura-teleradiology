import { IsNotEmpty, IsOptional, IsString, IsUrl, IsPhoneNumber, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCenterDto {
  @ApiProperty({
    description: 'Name of the center',
    example: 'City Medical Center',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Unique code for the center',
    example: 'CMC001',
  })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({
    description: 'Physical address of the center',
    example: '123 Medical Plaza, City, State, ZIP',
    required: false
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'Website URL of the center',
    example: 'https://www.medicalcenter.com',
    required: false
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({
    description: 'Phone number of the center',
    example: '+911234567890',
    required: false
  })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumbers?: string;

  @ApiProperty({
    description: 'Scopes or specialties of the center',
    example: ['Radiology', 'Cardiology', 'Neurology'],
    required: false,
    isArray: true,
    type: [String]
  })
  @IsOptional()
  @Transform(({ value }) => {
    // Convert comma-separated string to array if it's a string
    if (typeof value === 'string') {
      return value.split(',').map(item => item.trim());
    }
    return value;
  })
  @IsArray()
  @IsString({ each: true })
  centerScopes?: string[];
}
