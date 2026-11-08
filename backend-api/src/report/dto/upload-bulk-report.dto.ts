import { ApiProperty } from '@nestjs/swagger';
import { CreateReportDto } from './create-report.dto';

export class UploadBulkReportDto extends CreateReportDto {
  @ApiProperty({
    description: 'Files to upload',
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  files: any[];
}
