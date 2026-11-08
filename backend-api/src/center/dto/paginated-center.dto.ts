import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '../../common/dto/pagination-meta.dto';
import { Center } from '../entities/center.entity';
import { User } from '../../user/entities/user.entity';

export class CenterWithUsersDto {
  @ApiProperty({ description: 'Center ID' })
  id: string;

  @ApiProperty({ description: 'Center name' })
  name: string;

  @ApiProperty({ description: 'Center code' })
  code: string;

  @ApiProperty({ description: 'Center address', required: false })
  address?: string;

  @ApiProperty({ description: 'S3 path to the center logo', required: false })
  logo?: string;

  @ApiProperty({ description: 'Signed URL for the center logo', required: false })
  logoUrl?: string;

  @ApiProperty({ description: 'Website URL of the center', required: false })
  website?: string;

  @ApiProperty({ description: 'Phone number of the center', required: false })
  phoneNumbers?: string;

  @ApiProperty({ 
    description: 'Scopes or specialties of the center', 
    required: false,
    isArray: true,
    type: [String]
  })
  centerScopes?: string[];

  @ApiProperty({ description: 'Center creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Center last update date' })
  updatedAt: Date;
  
  @ApiProperty({ 
    description: 'Associated users with CENTER role',
    type: [User],
  })
  users: User[];
}

export class PaginatedCenterDto {
  @ApiProperty({
    description: 'Array of centers with their associated users',
    type: [CenterWithUsersDto],
  })
  data: CenterWithUsersDto[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;
}
