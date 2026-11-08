import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '../../common/dto/pagination-meta.dto';
import { Report } from '../entities/report.entity';

export class PaginatedReportDto {
  @ApiProperty({
    description: 'Array of report items for the current page',
    type: [Report],
  })
  data: Report[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;
}
