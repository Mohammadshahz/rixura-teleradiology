import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsBoolean, IsInt, Min, Max, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { UserRole } from '../enums/users.enum';
import { UserStatus } from '../enums/user-status.enum';

export class FilterUserDto {
  @ApiProperty({
    description: 'Filter users by role',
    enum: UserRole,
    required: false,
    example: 'RADIOLOGIST',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({
    description: 'Filter users by status',
    enum: UserStatus,
    required: false,
    example: 'ACTIVE',
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiProperty({
    description: 'Filter users by name (case insensitive, partial match)',
    required: false,
    example: 'John',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Whether to fetch signature URLs or not',
    required: false,
    default: false,
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  fetchSignature?: boolean;

  @ApiProperty({
    description: 'Page number (1-based)',
    required: false,
    default: 1,
    type: Number
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    default: 10,
    type: Number
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
