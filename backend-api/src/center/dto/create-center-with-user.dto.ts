import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateNested, IsEmail, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCenterDto } from './create-center.dto';
import { UserRole } from '../../user/enums/user-role.enum';
import { XRayType } from '../../report/enums/x-ray-type.enum';
import { IsValidXRayPrices } from '../../common/validators/is-valid-xray-prices.validator';

class CreateCenterUserDto {
  @ApiProperty({ description: 'User\'s full name', example: 'John Smith' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'User\'s email address', example: 'admin@centername.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Username for login', example: 'admin_center' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ description: 'Password for the user', example: 'StrongP@ssword123' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ description: 'User\'s mobile number', example: '+911234567890', required: false })
  @IsOptional()
  @IsString()
  mobileNumber?: string;

  @ApiProperty({ 
    description: 'Pricing for different X-ray types', 
    example: { 'CT-SCAN': { regular: 1000, review: 500 }, 'XRAY': { regular: 500, review: 250 }, 'MRI': { regular: 2000, review: 1000 } },
    required: false
  })
  @IsOptional()
  @IsValidXRayPrices()
  prices?: Record<XRayType, { regular: number; review: number }>;
}

export class CreateCenterWithUserDto {
  @ApiProperty({ type: CreateCenterDto })
  @ValidateNested()
  @Type(() => CreateCenterDto)
  center: CreateCenterDto;

  @ApiProperty({ type: CreateCenterUserDto })
  @ValidateNested()
  @Type(() => CreateCenterUserDto)
  user: CreateCenterUserDto;
}
