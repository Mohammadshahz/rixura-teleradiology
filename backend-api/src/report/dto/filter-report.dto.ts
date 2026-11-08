import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID, IsInt, IsPositive, Min, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { XRayType } from '../enums/x-ray-type.enum';
import { ReportType } from '../enums/report-type.enum';
import { ReportStatus } from '../enums/report-status.enum';

export class FilterReportDto {
  @ApiProperty({
    description: 'Filter by center ID',
    example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  centerId?: string;

  @ApiProperty({
    description: 'Filter by center code',
    example: 'CNTR001',
    required: false,
  })
  @IsString()
  @IsOptional()
  centerCode?: string;

  @ApiProperty({
    description: 'Filter by patient ID',
    example: 'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  patientId?: string;

  @ApiProperty({
    description: 'Filter by X-Ray type',
    enum: XRayType,
    example: XRayType.XRAY,
    required: false,
  })
  @IsEnum(XRayType)
  @IsOptional()
  xRayType?: XRayType;

  @ApiProperty({
    description: 'Filter by report type',
    enum: ReportType,
    example: ReportType.NORMAL,
    required: false,
  })
  @IsEnum(ReportType)
  @IsOptional()
  reportType?: ReportType;

  @ApiProperty({
    description: 'Filter by radiologist ID',
    example: 'c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  radiologistId?: string;
  
  @ApiProperty({
    description: 'Search by title',
    example: 'Chest',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Filter by report status',
    enum: ReportStatus,
    example: ReportStatus.IDLE,
    required: false,
  })
  @IsEnum(ReportStatus)
  @IsOptional()
  status?: ReportStatus;

  @ApiProperty({
    description: 'Filter by radiologist name',
    example: 'Dr. Jane Smith',
    required: false,
  })
  @IsString()
  @IsOptional()
  radiologistName?: string;

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
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @ApiProperty({
    description: 'Start date for filtering reports (ISO format: YYYY-MM-DD or YYYY-MM-DDThh:mm:ssZ)',
    example: '2025-01-01',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({
    description: 'End date for filtering reports (ISO format: YYYY-MM-DD or YYYY-MM-DDThh:mm:ssZ)',
    example: '2025-06-18',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;
}
