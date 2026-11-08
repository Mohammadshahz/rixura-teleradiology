import { ApiProperty } from '@nestjs/swagger';
import { ReportStatus } from '../enums/report-status.enum';
import { XRayType } from '../enums/x-ray-type.enum';
import { ReportType } from '../enums/report-type.enum';
import { Center } from '../../center/entities/center.entity';
import { Patient } from '../../patient/entities/patient.entity';
import { User } from '../../user/entities/user.entity';
import { Template } from '../../template/entities/template.entity';

export class GetReportDto {
  @ApiProperty({
    description: 'Unique identifier of the report',
    example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
  })
  id: string;

  @ApiProperty({
    description: 'When the report was created',
    example: '2025-06-15T10:28:36.600Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'When the report was last updated',
    example: '2025-06-15T10:28:36.600Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Center ID that the report belongs to',
    example: 'f0fd95eb-a689-4ff9-bb15-4d15d2e2b3c6',
  })
  centerId: string;

  @ApiProperty({
    description: 'Center that the report belongs to',
  })
  center: Center;

  @ApiProperty({
    description: 'Title of the report',
    example: 'Chest X-Ray Report',
  })
  title: string;

  @ApiProperty({
    description: 'Patient ID that the report belongs to',
    example: '37b86786-6871-42d9-8a7d-e1e766b5597a',
  })
  patientId: string;

  @ApiProperty({
    description: 'Patient that the report belongs to',
  })
  patient: Patient;

  @ApiProperty({
    description: 'Type of X-Ray',
    enum: XRayType,
    example: XRayType.XRAY,
  })
  xRayType: XRayType;

  @ApiProperty({
    description: 'Complaint or description of the issue',
    example: 'Patient experiencing chest pain and difficulty breathing',
  })
  complaint: string;

  @ApiProperty({
    description: 'Type of report',
    enum: ReportType,
    example: ReportType.NORMAL,
  })
  reportType: ReportType;

  @ApiProperty({
    description: 'URLs to the report files in S3',
    example: ['reports/123/file1.dcm', 'reports/123/file2.jpg'],
    isArray: true
  })
  reportUrls: string[];

  @ApiProperty({
    description: 'Radiologist ID who created the report',
    example: '4b20b7f8-2574-4fca-a0af-214ab713c90c',
    nullable: true,
  })
  radiologistId: string | null;

  @ApiProperty({
    description: 'Radiologist who created the report',
    nullable: true,
  })
  radiologist: User | null;

  @ApiProperty({
    description: 'Status of the report',
    enum: ReportStatus,
    example: ReportStatus.IDLE,
  })
  status: ReportStatus;

  @ApiProperty({
    description: 'Timestamp when the report was marked as reported',
    example: '2025-07-20T15:30:45.123Z',
    nullable: true,
  })
  reportedAt: Date | null;

  @ApiProperty({
    description: 'AI-generated content for the report',
    example: 'The X-ray shows normal lung fields with no evidence of infiltrates or consolidation...',
    nullable: true,
  })
  reportGeneratedContent: string | null;

  @ApiProperty({
    description: 'Template ID used to generate the report content',
    example: 'd4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9',
    nullable: true,
  })
  templateId: string | null;

  @ApiProperty({
    description: 'Template used to generate the report content',
    nullable: true,
  })
  template: Template | null;

  @ApiProperty({
    description: 'Count of unread comments for this report',
    example: 3,
  })
  unreadCommentsCount: number;

  @ApiProperty({
    description: 'Signed URLs for accessing report files',
    isArray: true,
    nullable: true,
  })
  signedReportUrls?: Array<{ key: string; signedUrl: string }>;
}
