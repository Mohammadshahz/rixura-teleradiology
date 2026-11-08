import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({ description: 'Total number of items across all pages' })
  total: number;
  
  @ApiProperty({ description: 'Current page number' })
  page: number;
  
  @ApiProperty({ description: 'Number of items per page' })
  limit: number;
  
  @ApiProperty({ description: 'Total number of pages' })
  pages: number;
  
  @ApiProperty({ description: 'Indicates if there is a page after the current one' })
  hasNextPage: boolean;
  
  @ApiProperty({ description: 'Indicates if there is a page before the current one' })
  hasPreviousPage: boolean;
}

export class PaginationResponseDto<T> {
  @ApiProperty({ description: 'Array of items for the current page' })
  data: T[];

  @ApiProperty({ description: 'Pagination metadata', type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
