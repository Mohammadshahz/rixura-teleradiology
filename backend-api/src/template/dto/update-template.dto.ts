import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { TemplateType } from '../enums/template-type.enum';

export class UpdateTemplateDto {
  @ApiProperty({
    example: 'Updated Brain MRI Template',
    description: 'The updated title of the template',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: 'CUSTOM',
    description: 'The updated type of the template',
    enum: TemplateType,
    required: false,
  })
  @IsEnum(TemplateType)
  @IsOptional()
  type?: TemplateType;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'The updated UUID of the radiologist who owns this template',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  radiologistId?: string;

  @ApiProperty({
    example: 'Updated detailed template for standard brain MRI reporting',
    description: 'Updated description of the template',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
