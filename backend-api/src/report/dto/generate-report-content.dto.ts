import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class GenerateReportContentDto {
  @ApiProperty({
    description: 'AI-generated content for the report',
    example: 'The X-ray shows normal lung fields with no evidence of infiltrates or consolidation...',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  reportGeneratedContent: string;

  @ApiProperty({
    description: 'Template ID used to generate the report content',
    example: 'd4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9',
    required: false,
    nullable: true
  })
  @IsOptional()
  @IsUUID()
  templateId?: string;
}
