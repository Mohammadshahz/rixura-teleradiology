import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { XRayType } from '../enums/x-ray-type.enum';
import { ReportType } from '../enums/report-type.enum';

export class UploadReportDto {
  @ApiProperty({
    description: 'Center ID that the report belongs to',
    example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
  })
  @IsUUID()
  @IsNotEmpty()
  centerId: string;

  @ApiProperty({
    description: 'Title of the report',
    example: 'Chest X-Ray Report',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Patient ID that the report belongs to',
    example: 'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7',
  })
  @IsUUID()
  @IsNotEmpty()
  patientId: string;

  @ApiProperty({
    description: 'Type of X-Ray',
    enum: XRayType,
    example: XRayType.XRAY,
  })
  @IsEnum(XRayType)
  @IsNotEmpty()
  xRayType: XRayType;

  @ApiProperty({
    description: 'Complaint or description of the issue',
    example: 'Patient experiencing chest pain and difficulty breathing',
  })
  @IsString()
  @IsNotEmpty()
  complaint: string;

  @ApiProperty({
    description: 'Type of report',
    enum: ReportType,
    example: ReportType.NORMAL,
  })
  @IsEnum(ReportType)
  @IsNotEmpty()
  reportType: ReportType;

  @ApiProperty({
    description: 'Radiologist ID who created the report',
    example: 'c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8',
  })
  @IsUUID()
  @IsNotEmpty()
  radiologistId: string;
  
  // The actual file will be handled by @UploadedFile() in the controller
}
