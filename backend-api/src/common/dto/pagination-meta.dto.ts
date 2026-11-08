import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({
    description: 'Total number of items across all pages',
    example: 100,
    type: Number,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number (1-based)',
    example: 1,
    type: Number,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    type: Number,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 10,
    type: Number,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Whether there is a previous page available',
    example: false,
    type: Boolean,
  })
  hasPreviousPage: boolean;

  @ApiProperty({
    description: 'Whether there is a next page available',
    example: true,
    type: Boolean,
  })
  hasNextPage: boolean;
}
