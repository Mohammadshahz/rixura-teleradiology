import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';
import { UpdateReportDto } from './update-report.dto';

export class UpdateReportWithFilesDto extends UpdateReportDto {
  @ApiProperty({
    description: 'Files to upload',
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    required: false,
  })
  @IsArray()
  @IsOptional()
  files?: any[];
}
