import { ApiProperty } from '@nestjs/swagger';

export class RevenueDataPoint {
  @ApiProperty({ description: 'Time label (day, month, quarter, year)' })
  key: string;

  @ApiProperty({ description: 'Revenue amount for the period' })
  value: number;
}

export class RevenueGraphResponseDto {
  @ApiProperty({
    description: 'Revenue data as array of key-value pairs',
    type: [RevenueDataPoint],
    example: [
      { key: 'JAN', value: 5000 },
      { key: 'FEB', value: 3000 },
      { key: 'MAR', value: 4500 },
    ]
  })
  data: RevenueDataPoint[];
}
