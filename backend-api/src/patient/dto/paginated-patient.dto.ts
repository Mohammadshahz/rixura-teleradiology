import { Patient } from '../entities/patient.entity';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '../../common/dto/pagination-meta.dto';

export class PaginatedPatientDto {
  @ApiProperty({
    description: 'Array of patient records',
    type: [Patient],
  })
  data: Patient[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;
}
