import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserStatus } from '../enums/user-status.enum';
import { UserRole } from '../enums/user-role.enum';

export class CreateAdminDto {
  @ApiProperty({ description: 'User\'s full name', example: 'Admin User' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'User\'s email address', example: 'admin@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Username for login', example: 'adminuser' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ description: 'Password for login', example: 'SecurePassword123!' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ description: 'User\'s mobile number', example: '+911234567890', required: false })
  @IsOptional()
  @IsString()
  mobileNumber?: string;

  @ApiProperty({ description: 'User\'s address', example: '123 Admin St, City, State, ZIP', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'User status',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
    required: false
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
