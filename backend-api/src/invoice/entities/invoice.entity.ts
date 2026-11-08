import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../user/enums/user-role.enum';
import { InvoiceStatus } from '../enums/invoice-status.enum';
import { Report } from '../../report/entities/report.entity';
import { XRayType } from '../../report/enums/x-ray-type.enum';
import { InvoiceReportType } from '../enums/invoice-report-type.enum';

@Entity('invoices')
export class Invoice extends BaseEntity {
  @ApiProperty({
    description: 'ID of the user associated with this invoice',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @Column()
  userId: string;

  @ApiProperty({
    description: 'Type of user (RADIOLOGIST or CENTER only)',
    enum: [UserRole.RADIOLOGIST, UserRole.CENTER],
    example: 'RADIOLOGIST',
  })
  @Column({
    type: 'enum',
    enum: [UserRole.RADIOLOGIST, UserRole.CENTER],
  })
  userType: UserRole;

  @ApiProperty({
    description: 'Amount of the invoice',
    example: 1000.50,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({
    description: 'Status of the invoice',
    enum: InvoiceStatus,
    example: 'PENDING',
  })
  @Column({
    type: 'enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.PENDING,
  })
  status: InvoiceStatus;

  @ApiProperty({
    description: 'Transaction ID (optional)',
    example: 'TRX-123456',
    required: false,
  })
  @Column({ nullable: true })
  transactionId: string;

  @ApiProperty({
    description: 'ID of the report associated with this invoice',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    required: false,
  })
  @Column({ nullable: true })
  reportId: string;
  
  @ManyToOne(() => Report, { nullable: true })
  @JoinColumn({ name: 'reportId' })
  report: Report;

  @ApiProperty({
    description: 'Type of X-ray',
    enum: XRayType,
    example: XRayType.XRAY,
  })
  @Column({
    type: 'enum',
    enum: XRayType,
    nullable: true
  })
  xRayType: XRayType;

  @ApiProperty({
    description: 'Type of invoice report (REGULAR or REVIEW)',
    enum: InvoiceReportType,
    example: InvoiceReportType.REGULAR,
  })
  @Column({
    type: 'enum',
    enum: InvoiceReportType,
    nullable: true,
    name: "invoice_report_type"
  })
  invoiceReportType: InvoiceReportType;
}
