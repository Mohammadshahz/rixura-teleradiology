import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { UserRole } from '../../user/enums/user-role.enum';
import { InvoiceStatus } from '../enums/invoice-status.enum';
import { XRayType } from '../../report/enums/x-ray-type.enum';
import { InvoiceReportType } from '../enums/invoice-report-type.enum';

export class CreateInvoiceDto {
  @ApiProperty({
    description: 'ID of the user associated with this invoice',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Type of user (RADIOLOGIST or CENTER only)',
    enum: [UserRole.RADIOLOGIST, UserRole.CENTER],
    example: 'RADIOLOGIST',
  })
  @IsEnum([UserRole.RADIOLOGIST, UserRole.CENTER])
  @IsNotEmpty()
  userType: UserRole;

  @ApiProperty({
    description: 'Amount of the invoice',
    example: 1000.50,
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    description: 'Status of the invoice',
    enum: InvoiceStatus,
    example: 'PENDING',
    default: InvoiceStatus.PENDING,
  })
  @IsEnum(InvoiceStatus)
  @IsOptional()
  status?: InvoiceStatus;

  @ApiProperty({
    description: 'Transaction ID (optional)',
    example: 'TRX-123456',
    required: false,
  })
  @IsString()
  @IsOptional()
  transactionId?: string;

  @ApiProperty({
    description: 'ID of the report associated with this invoice',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  reportId?: string;
  
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
