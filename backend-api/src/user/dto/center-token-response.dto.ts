import { ApiProperty } from '@nestjs/swagger';
import { TokenResponseDto } from './token-response.dto';

export class CenterTokenResponseDto extends TokenResponseDto {
  @ApiProperty({
    description: 'Center ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  centerId: string;

  @ApiProperty({
    description: 'Center name',
    example: 'City Medical Center',
  })
  centerName: string;

  @ApiProperty({
    description: 'Center code',
    example: 'CMC001',
  })
  centerCode: string;
}
