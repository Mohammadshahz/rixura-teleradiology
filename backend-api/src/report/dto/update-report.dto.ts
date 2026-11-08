import { PartialType } from '@nestjs/mapped-types';
import { CreateReportDto } from './create-report.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID, IsArray } from 'class-validator';
import { XRayType } from '../enums/x-ray-type.enum';
import { ReportType } from '../enums/report-type.enum';
import { ReportStatus } from '../enums/report-status.enum';

export class UpdateReportDto extends PartialType(CreateReportDto) {
  @ApiProperty({
    description: 'Title of the report',
    example: 'Updated Chest X-Ray Report',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Type of X-Ray',
    enum: XRayType,
    example: XRayType.CT_SCAN,
    required: false,
  })
  @IsEnum(XRayType)
  @IsOptional()
  xRayType?: XRayType;

  @ApiProperty({
    description: 'Complaint or description of the issue',
    example: 'Updated: Patient experiencing chest pain and difficulty breathing',
    required: false,
  })
  @IsString()
  @IsOptional()
  complaint?: string;

  @ApiProperty({
    description: 'Type of report',
    enum: ReportType,
    example: ReportType.CRITICAL,
    required: false,
  })
  @IsEnum(ReportType)
  @IsOptional()
  reportType?: ReportType;

  @ApiProperty({
    description: 'Radiologist ID who updated the report',
    example: 'c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  radiologistId?: string;

  @ApiProperty({
    description: 'Status of the report',
    enum: ReportStatus,
    example: ReportStatus.ACCEPTED,
    required: false,
  })
  @IsEnum(ReportStatus)
  @IsOptional()
  status?: ReportStatus;

  @ApiProperty({
    description: 'Array of report file URLs', 
    type: [String],
    example: ['centers/center-123/reports/report-456/file1.jpg', 'centers/center-123/reports/report-456/file2.pdf'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  reportUrls?: string[];
}
