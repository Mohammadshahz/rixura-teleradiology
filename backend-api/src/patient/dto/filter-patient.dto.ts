import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsDate,
  MinDate,
  MaxDate,
  IsInt,
  Min,
  Max,
  IsUUID,
} from 'class-validator';
import { Gender } from '../../common/enums/gender.enum';

export class FilterPatientDto {
  @ApiProperty({
    description: 'Page number (1-based)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    description: 'Filter by patient name (case-insensitive)',
    example: 'John',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Filter by center patient number',
    example: 5,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  centerPatientNumber?: number;

  @ApiProperty({
    description: 'Filter by patient ID',
    example: '1234',
    required: false,
  })
  @IsOptional()
  @IsString()
  patientId?: string;

  @ApiProperty({
    description: 'Filter by minimum age',
    example: 18,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(150)
  @Type(() => Number)
  minAge?: number;

  @ApiProperty({
    description: 'Filter by maximum age',
    example: 65,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(150)
  @Type(() => Number)
  maxAge?: number;

  @ApiProperty({
    description: 'Filter by gender',
    example: Gender.MALE,
    enum: Gender,
    required: false,
  })
  @IsOptional()
  @IsEnum(Gender, { message: 'Gender must be either male, female, or others' })
  gender?: Gender;
}
