import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { InvoiceStatus } from '../enums/invoice-status.enum';
import { XRayType } from '../../report/enums/x-ray-type.enum';
import { InvoiceReportType } from '../enums/invoice-report-type.enum';

export class InvoiceSummaryQueryDto {
  @ApiProperty({
    description: 'User ID to get summary for (optional - if not provided, summary of all invoices will be returned)',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  userId?: string;
  
  @ApiProperty({
    description: 'Status of invoices to include in summary',
    enum: InvoiceStatus,
    example: 'PENDING',
    required: false,
  })
  @IsEnum(InvoiceStatus)
  @IsOptional()
  status?: InvoiceStatus;
  
  @ApiProperty({
    description: 'Filter invoices created on or after this date (ISO format)',
    example: '2025-01-01T00:00:00.000Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({
    description: 'Filter invoices created on or before this date (ISO format)',
    example: '2025-12-31T23:59:59.999Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;
  
  @ApiProperty({
    description: 'ID of the report to filter by',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  reportId?: string;
  
  @ApiProperty({
    description: 'Transaction ID to filter invoices by',
    example: 'TRX-12345',
    required: false,
  })
  @IsString()
  @IsOptional()
  transactionId?: string;
  
  @ApiProperty({
    description: 'Type of X-ray to filter by',
    enum: XRayType,
    example: XRayType.XRAY,
    required: false,
  })
  @IsEnum(XRayType)
  @IsOptional()
  xRayType?: XRayType;
  
  @ApiProperty({
    description: 'Type of invoice report (REGULAR or REVIEW)',
    enum: InvoiceReportType,
    example: InvoiceReportType.REGULAR,
    required: false,
  })
  @IsEnum(InvoiceReportType)
  @IsOptional()
  invoiceReportType?: InvoiceReportType;
}

export class InvoiceSummaryResponseDto {
  @ApiProperty({
    description: 'User ID (null when summary is for all invoices)',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    required: false,
    nullable: true
  })
  userId?: string | null;
  
  @ApiProperty({
    description: 'Total number of invoices',
    example: 42,
  })
  reportsCount: number;
  
  @ApiProperty({
    description: 'Total amount of all invoices',
    example: 15750.50,
  })
  totalAmount: number;
  
  @ApiProperty({
    description: 'Number of pending invoices',
    example: 12,
  })
  pendingCount: number;
  
  @ApiProperty({
    description: 'Total amount of pending invoices',
    example: 4500.25,
  })
  pendingAmount: number;
  
  @ApiProperty({
    description: 'Number of completed invoices',
    example: 30,
  })
  completedCount: number;
  
  @ApiProperty({
    description: 'Total amount of completed invoices',
    example: 11250.25,
  })
  completedAmount: number;
  
  @ApiProperty({
    description: 'Period start date',
    example: '2025-01-01T00:00:00.000Z',
  })
  startDate?: string;
  
  @ApiProperty({
    description: 'Period end date',
    example: '2025-12-31T23:59:59.999Z',
  })
  endDate?: string;
}
