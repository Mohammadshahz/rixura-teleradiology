import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export enum TimePeriod {
  DAILY = 'DAILY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
}

export class DashboardFilterDto {
  @ApiProperty({
    description: 'Time period filter for dashboard data',
    enum: TimePeriod,
    default: TimePeriod.MONTHLY,
    required: false,
  })
  @IsEnum(TimePeriod)
  @IsOptional()
  timePeriod: TimePeriod = TimePeriod.MONTHLY;
}
