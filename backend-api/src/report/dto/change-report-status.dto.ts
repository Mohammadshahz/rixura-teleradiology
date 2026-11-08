import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ReportStatus } from '../enums/report-status.enum';

export class ChangeReportStatusDto {
  @ApiProperty({
    description: 'New status for the report',
    enum: ReportStatus,
    example: ReportStatus.ACCEPTED,
  })
  @IsNotEmpty()
  @IsEnum(ReportStatus)
  status: ReportStatus;
}
