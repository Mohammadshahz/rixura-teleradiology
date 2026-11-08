import { ApiProperty } from '@nestjs/swagger';
import { TemplateResponseDto } from './template-response.dto';

export class PaginatedTemplateDto {
  @ApiProperty({ 
    description: 'List of templates', 
    type: [TemplateResponseDto] 
  })
  data: TemplateResponseDto[];

  @ApiProperty({ 
    description: 'Total number of templates matching the filters' 
  })
  total: number;

  @ApiProperty({ 
    description: 'Current page number' 
  })
  page: number;

  @ApiProperty({ 
    description: 'Number of items per page' 
  })
  limit: number;

  @ApiProperty({ 
    description: 'Total number of pages' 
  })
  totalPages: number;
}
