import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';
import { XRayType } from '../../report/enums/x-ray-type.enum';
import { Transform } from 'class-transformer';
import { IsValidXRayPrices } from '../../common/validators/is-valid-xray-prices.validator';

export class UpdateUserDto {
  @ApiProperty({ description: 'User\'s full name', example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'User\'s role',
    enum: UserRole,
    example: UserRole.RADIOLOGIST,
    required: false
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({ description: 'User\'s email address', example: 'john.doe@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Username for login', example: 'johndoe', required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ description: 'User\'s mobile number', example: '+911234567890', required: false })
  @IsOptional()
  @IsString()
  mobileNumber?: string;

  @ApiProperty({ description: 'User\'s address', example: '123 Main St, City, State, ZIP', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: 'URL to user\'s signature image', required: false })
  @IsOptional()
  @IsString()
  signatureUrl?: string;

  @ApiProperty({
    description: 'User status',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
    required: false
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiProperty({
    description: 'Prices for different X-ray types',
    example: {
      [XRayType.CT_SCAN]: { regular: 50, review: 25 },
      [XRayType.XRAY]: { regular: 20, review: 10 },
      [XRayType.MRI]: { regular: 100, review: 50 }
    },
    required: false
  })
  @IsOptional()
  @Transform(({ value }) => {
    // If value is already an object, return it as is
    if (typeof value === 'object' && !Array.isArray(value)) {
      return value;
    }
    
    // If value is a string, try to parse it as JSON
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        // If parsing fails, return the original value
        // The validator will handle the error
        return value;
      }
    }
    
    return value;
  })
  @IsValidXRayPrices({
    message: 'Prices must be an object with XRayType keys and nested \'regular\' and \'review\' properties with positive number values'
  })
  prices?: Record<XRayType, { regular: number; review: number }>;
}
