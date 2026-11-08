import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ReportStatus } from '../enums/report-status.enum';

export class UpdateReportRadiologistStatusDto {
  @ApiProperty({
    description: 'The ID of the radiologist to assign to the report, or null to unassign',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    nullable: true
  })
  @IsUUID()
  @IsOptional()
  radiologistId?: string | null;

  @ApiProperty({
    description: 'New status for the report',
    enum: ReportStatus,
    example: ReportStatus.ACCEPTED,
    required: true
  })
  @IsNotEmpty()
  @IsEnum(ReportStatus)
  status: ReportStatus;

  @ApiProperty({
    description: 'Flag to indicate whether to remove the radiologist from the report',
    example: false,
    required: false,
    default: false
  })
  @IsBoolean()
  @IsOptional()
  removeRadiologist?: boolean;
}
