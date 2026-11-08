import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty({
    description: 'Description of the feedback',
    example: 'The report generation workflow is very intuitive and user-friendly.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'ID of the user who provided the feedback',
    example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
