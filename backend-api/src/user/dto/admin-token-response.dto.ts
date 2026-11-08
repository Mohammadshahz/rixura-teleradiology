import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../enums/user-role.enum';

export class AdminTokenResponseDto {
  @ApiProperty({
    description: 'JWT access token for API authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  accessToken: string;

  @ApiProperty({
    description: 'JWT refresh token for obtaining new access tokens',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  refreshToken: string;

  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  userId: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: 'ADMIN'
  })
  role: UserRole;

  @ApiProperty({
    description: 'Username',
    example: 'admin'
  })
  username: string;

  @ApiProperty({
    description: 'Token type',
    example: 'Bearer'
  })
  tokenType: string = 'Bearer';

  @ApiProperty({
    description: 'Admin dashboard access details',
    example: {
      permissions: ['user_management', 'center_management', 'report_access'],
      lastLogin: '2025-06-24T13:00:00Z'
    }
  })
  adminAccess: {
    permissions: string[];
    lastLogin?: string;
  };
}
