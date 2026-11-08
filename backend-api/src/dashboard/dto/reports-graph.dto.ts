import { ApiProperty } from '@nestjs/swagger';

export class ReportDataPoint {
  @ApiProperty({ description: 'Time label (day, month, quarter, year)' })
  key: string;

  @ApiProperty({ description: 'Reports count for the period' })
  value: number;
}

export class ReportsGraphResponseDto {
  @ApiProperty({
    description: 'Reports count data as array of key-value pairs',
    type: [ReportDataPoint],
    example: [
      { key: 'JAN', value: 50 },
      { key: 'FEB', value: 30 },
      { key: 'MAR', value: 45 },
    ]
  })
  data: ReportDataPoint[];
}
