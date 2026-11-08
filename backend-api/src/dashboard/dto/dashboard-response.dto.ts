import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';

export class ReportCounts {
  @ApiProperty({ description: 'Total number of reports' })
  total: number;

  @ApiProperty({ description: 'Number of reports with REPORTED status' })
  reported_reports: number;

  @ApiProperty({ description: 'Number of reports with IDLE status' })
  idle_reports: number;

  @ApiProperty({ description: 'Number of reports with REVERTED status' })
  reverted_reports: number;

  @ApiProperty({ description: 'Number of reports with COMPLETED status' })
  completed_reports: number;

  @ApiProperty({ description: 'Number of reports with ACCEPTED status' })
  accepted_reports: number;
}

export class CardData {
  @ApiProperty({ description: 'Total revenue from invoices for radiologists' })
  total_revenue: number;

  @ApiProperty({ description: 'Total number of radiologists' })
  total_radiologists: number;

  @ApiProperty({ description: 'Total number of centers' })
  total_centers: number;

  @ApiProperty({ description: 'Total expenditures from invoices for centers' })
  total_expenditures: number;
}

export class PeriodComparisonData {
  @ApiProperty({ type: CardData, description: 'Current period data' })
  current: CardData;

  @ApiProperty({ type: CardData, description: 'Previous period data' })
  previous: CardData;
}

export class ReportComparisonData {
  @ApiProperty({ type: ReportCounts, description: 'Current period data' })
  current: ReportCounts;

  @ApiProperty({ type: ReportCounts, description: 'Previous period data' })
  previous: ReportCounts;
}

export class TopRadiologistDto {
  @ApiProperty({ description: 'The radiologist user ID' })
  userId: string;

  @ApiProperty({ description: 'The radiologist name' })
  name: string;

  @ApiProperty({ description: 'The radiologist email' })
  email: string;

  @ApiProperty({ description: 'Number of reported reports by this radiologist' })
  reportCount: number;
}

export class DashboardResponseDto {
  @ApiProperty({ description: 'Card data with revenue, radiologists, centers, and expenditure metrics', type: PeriodComparisonData })
  card_data: PeriodComparisonData;

  @ApiProperty({ description: 'Total report counts by status', type: ReportComparisonData })
  total_reports: ReportComparisonData;

  @ApiProperty({ 
    description: 'Top 3 radiologists with most reported reports', 
    type: [TopRadiologistDto],
    maxItems: 3
  })
  most_top_reported_radiologists: TopRadiologistDto[];
}
