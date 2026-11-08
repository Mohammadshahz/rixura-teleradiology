import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class FilterCenterDto {
  @ApiProperty({
    description: 'Search by center name',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Search by center code',
    required: false,
  })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({
    description: 'Search by center address',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;
  
  @ApiProperty({
    description: 'Search by center website',
    required: false,
  })
  @IsString()
  @IsOptional()
  website?: string;
  
  @ApiProperty({
    description: 'Search by center phone number',
    required: false,
  })
  @IsString()
  @IsOptional()
  phoneNumbers?: string;
  
  @ApiProperty({
    description: 'Search by center scope/specialty',
    required: false,
  })
  @IsString()
  @IsOptional()
  centerScopes?: string;

  @ApiProperty({
    description: 'Page number (1-based indexing)',
    example: 1,
    required: false,
    default: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    required: false,
    default: 10,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}
