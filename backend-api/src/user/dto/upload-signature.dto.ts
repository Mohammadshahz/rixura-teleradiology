import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UploadSignatureDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Signature image file (PNG, JPEG, JPG)',
  })
  file: any;
}
