import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateReportTitleDto {
  @ApiProperty({
    description: 'Title of the report',
    example: 'Updated Chest X-Ray Report',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;
}
