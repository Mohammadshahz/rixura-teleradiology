import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateReportCommentDto {
  @ApiProperty({
    description: 'ID of the report this comment belongs to',
    example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
  })
  @IsUUID()
  @IsNotEmpty()
  reportId: string;

  @ApiProperty({
    description: 'Content of the comment',
    example: 'Please review the abnormality in the lower right section of the X-ray.',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
  
  @ApiProperty({
    description: 'Center ID if the comment is from/to a center',
    example: 'c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8',
    required: false
  })
  @IsUUID()
  @IsOptional()
  centerId?: string;

  @ApiProperty({
    description: 'Radiologist ID if the comment is from/to a radiologist',
    example: 'r3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8',
    required: false
  })
  @IsUUID()
  @IsOptional()
  radiologistId?: string;
}