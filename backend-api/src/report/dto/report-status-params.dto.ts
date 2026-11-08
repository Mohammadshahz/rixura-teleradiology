import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class ReportStatusParamsDto {
  @ApiProperty({
    description: 'Report ID',
    example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
  })
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'User ID of the user making the change',
    example: 'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7',
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
