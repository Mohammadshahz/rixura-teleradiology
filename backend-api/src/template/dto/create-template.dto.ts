import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';
import { TemplateType } from '../enums/template-type.enum';
import { IsValidTemplateTypeRadiologist } from '../validators/template-type-radiologist.validator';

@IsValidTemplateTypeRadiologist({
  message: 'Template type and radiologistId have an invalid combination: DEFAULT templates must have null radiologistId and CUSTOM templates must have a radiologistId'
})
export class CreateTemplateDto {
  @ApiProperty({
    example: 'Brain MRI Template',
    description: 'The title of the template',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'DEFAULT',
    description: 'The type of the template',
    enum: TemplateType,
  })
  @IsEnum(TemplateType)
  type: TemplateType;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'The UUID of the radiologist who created/owns this template',
    nullable: true
  })
  @IsUUID()
  @IsOptional()
  radiologistId: string | null;

  @ApiProperty({
    example: 'Detailed template for standard brain MRI reporting',
    description: 'Description of the template',
  })
  @IsString()
  description: string;
}
