import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, IsDateString, IsBoolean } from 'class-validator';
import { UserRole } from '../../user/enums/user-role.enum';
import { InvoiceStatus } from '../enums/invoice-status.enum';
import { XRayType } from '../../report/enums/x-ray-type.enum';
import { InvoiceReportType } from '../enums/invoice-report-type.enum';
import { Type, Transform } from 'class-transformer';

export class FilterInvoiceDto {
  @ApiProperty({
    description: 'Enable pagination (true) or return all results (false)',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  pagination?: boolean = true;
  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of records per page',
    example: 10,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @ApiProperty({
    description: 'ID of the user to filter by',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiProperty({
    description: 'Type of user (RADIOLOGIST or CENTER only)',
    enum: [UserRole.RADIOLOGIST, UserRole.CENTER],
    example: 'RADIOLOGIST',
    required: false,
  })
  @IsEnum([UserRole.RADIOLOGIST, UserRole.CENTER])
  @IsOptional()
  userType?: UserRole;

  @ApiProperty({
    description: 'Status of the invoice',
    enum: InvoiceStatus,
    example: 'PENDING',
    required: false,
  })
  @IsEnum(InvoiceStatus)
  @IsOptional()
  status?: InvoiceStatus;

  @ApiProperty({
    description: 'Transaction ID to filter by',
    example: 'TRX-123456',
    required: false,
  })
  @IsString()
  @IsOptional()
  transactionId?: string;

  @ApiProperty({
    description: 'ID of the report to filter by',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  reportId?: string;

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
    description: 'Type of X-ray',
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
