import { ApiProperty } from '@nestjs/swagger';
import { Template } from '../entities/template.entity';
import { TemplateType } from '../enums/template-type.enum';

export class TemplateResponseDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'The unique identifier of the template (UUID)',
  })
  id: string;

  @ApiProperty({
    example: 'Brain MRI Template',
    description: 'The title of the template',
  })
  title: string;

  @ApiProperty({
    example: 'DEFAULT',
    description: 'The type of the template',
    enum: TemplateType,
  })
  type: TemplateType;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'The UUID of the radiologist who created/owns this template',
  })
  radiologistId: string;

  @ApiProperty({
    example: 'Detailed template for standard brain MRI reporting',
    description: 'Description of the template',
  })
  description: string;

  @ApiProperty({
    example: '2025-06-16T10:00:00Z',
    description: 'The date and time when the template was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-06-16T10:30:00Z',
    description: 'The date and time when the template was last updated',
  })
  updatedAt: Date;

  constructor(template: Template) {
    this.id = template.id;
    this.title = template.title;
    this.type = template.type;
    this.radiologistId = template.radiologistId;
    this.description = template.description;
    this.createdAt = template.createdAt;
    this.updatedAt = template.updatedAt;
  }
}
