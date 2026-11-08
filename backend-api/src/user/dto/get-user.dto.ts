import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetUserDto {
  @ApiProperty({
    description: 'Whether to fetch signature URL or not',
    required: false,
    default: true,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    // Default to true if undefined
    if (value === undefined) return true;
    // Convert string representation to boolean
    return value === 'true' || value === '1' || value === true;
  })
  fetchSignature?: boolean;
}
