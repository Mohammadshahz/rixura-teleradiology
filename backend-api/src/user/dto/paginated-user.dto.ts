import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class PaginatedUserDto {
  @ApiProperty({
    description: 'Array of users',
    type: [User]
  })
  data: User[];

  @ApiProperty({
    description: 'Total number of users matching the query',
    example: 42
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 5
  })
  totalPages: number;
}
