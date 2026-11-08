import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from '../entities/invoice.entity';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';
import { UpdateInvoiceDto } from '../dto/update-invoice.dto';
import { FilterInvoiceDto } from '../dto/filter-invoice.dto';
import { InvoiceSummaryQueryDto, InvoiceSummaryResponseDto } from '../dto/invoice-summary.dto';
import { InvoiceStatus } from '../enums/invoice-status.enum';
import { PaginationResponseDto } from '../../common/dto/pagination-response.dto';
import { UserRole } from '../../user/enums/user-role.enum';
import { PaginationMetaDto } from '../../common/dto/pagination-meta.dto';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const invoice = this.invoiceRepository.create(createInvoiceDto);
    return this.invoiceRepository.save(invoice);
  }

  async findAll(filterDto: FilterInvoiceDto): Promise<PaginationResponseDto<Invoice>> {
    const { pagination = true, page = 1, limit = 10, userId, userType, status, transactionId, startDate, endDate, reportId, xRayType, invoiceReportType } = filterDto;
    
    const queryBuilder = this.invoiceRepository.createQueryBuilder('invoice');
    
    // Join report relation if available
    queryBuilder.leftJoinAndSelect('invoice.report', 'report');

    if (userId) {
      queryBuilder.andWhere('invoice.userId = :userId', { userId });
    }

    if (userType) {
      queryBuilder.andWhere('invoice.userType = :userType', { userType });
    }

    if (status) {
      queryBuilder.andWhere('invoice.status = :status', { status });
    }

    if (transactionId) {
      queryBuilder.andWhere('invoice.transactionId LIKE :transactionId', { transactionId: `%${transactionId}%` });
    }
    
    if (reportId) {
      queryBuilder.andWhere('invoice.reportId = :reportId', { reportId });
    }
    
    if (xRayType) {
      queryBuilder.andWhere('invoice.xRayType = :xRayType', { xRayType });
    }

    if (invoiceReportType) {
      queryBuilder.andWhere('invoice.invoiceReportType = :invoiceReportType', { invoiceReportType });
    }

    // Add date range filtering
    if (startDate) {
      const startDateTime = new Date(startDate);
      // Set to beginning of the day (00:00:00)
      startDateTime.setHours(0, 0, 0, 0);
      queryBuilder.andWhere('invoice.createdAt >= :startDate', { startDate: startDateTime });
    }

    if (endDate) {
      const endDateTime = new Date(endDate);
      // Set to end of the day (23:59:59.999)
      endDateTime.setHours(23, 59, 59, 999);
      queryBuilder.andWhere('invoice.createdAt <= :endDate', { endDate: endDateTime });
    }

    // Always apply ordering for consistent results
    queryBuilder.orderBy('invoice.createdAt', 'DESC');
    
    // Get total count
    const total = await queryBuilder.getCount();
    
    let data: Invoice[];
    let meta: any;
    
    // Apply pagination only if enabled
    if (pagination) {
      const skip = (page - 1) * limit;
      
      data = await queryBuilder
        .skip(skip)
        .take(limit)
        .getMany();
        
      // Calculate pagination metadata
      const pages = Math.ceil(total / limit);
      const hasNextPage = page < pages;
      const hasPreviousPage = page > 1;

      // Create meta object for pagination data
      meta = {
        total,
        page,
        limit,
        pages,
        hasNextPage,
        hasPreviousPage
      };
    } else {
      // Get all data without pagination
      data = await queryBuilder.getMany();
      
      // Simplified meta for non-paginated results
      meta = {
        total,
        pagination: false
      };
    }

    // Return response with meta object
    return {
      data,
      meta
    };
  }

  async findOne(id: string): Promise<Invoice> {
    // Use queryBuilder for more complex joins
    const queryBuilder = this.invoiceRepository.createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.report', 'report')
      .leftJoinAndSelect('report.center', 'center')
      .leftJoinAndSelect('report.radiologist', 'radiologist')
      .where('invoice.id = :id', { id });
      
    const invoice = await queryBuilder.getOne();
    
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    
    return invoice;
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice> {
    const invoice = await this.findOne(id);
    
    Object.assign(invoice, updateInvoiceDto);
    
    return this.invoiceRepository.save(invoice);
  }

  async remove(id: string): Promise<void> {
    const result = await this.invoiceRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
  }

  async getSummary(summaryQueryDto: InvoiceSummaryQueryDto): Promise<InvoiceSummaryResponseDto> {
    const { userId, status, startDate, endDate, reportId, transactionId, xRayType } = summaryQueryDto;
    
    // Initialize query builder without userId filter initially
    const queryBuilder = this.invoiceRepository.createQueryBuilder('invoice');
    
    // Apply userId filter only if provided
    if (userId) {
      queryBuilder.where('invoice.userId = :userId', { userId });
    }

    if (status) {
      // Ensure the status is a valid enum value from InvoiceStatus
      if (Object.values(InvoiceStatus).includes(status)) {
        queryBuilder.andWhere('invoice.status = :status', { status: status.toString() });
      } else {
        throw new BadRequestException(`Invalid status: ${status}. Must be one of: ${Object.values(InvoiceStatus).join(', ')}`);
      }
    }

    if (reportId) {
      queryBuilder.andWhere('invoice.reportId = :reportId', { reportId });
    }
    
    if (transactionId) {
      queryBuilder.andWhere('invoice.transactionId LIKE :transactionId', { transactionId: `%${transactionId}%` });
    }
    
    if (xRayType) {
      queryBuilder.andWhere('invoice.xRayType = :xRayType', { xRayType });
    }
    
    // Add date range filtering
    if (startDate) {
      queryBuilder.andWhere('invoice.createdAt >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('invoice.createdAt <= :endDate', { endDate });
    }

    // Get all invoices that match the criteria
    const invoices = await queryBuilder.getMany();
    
    // Calculate summary values
    const totalAmount = invoices.reduce((sum, invoice) => sum + parseFloat(invoice.amount.toString()), 0);
    const pendingInvoices = invoices.filter(invoice => invoice.status === InvoiceStatus.PENDING);
    const completedInvoices = invoices.filter(invoice => invoice.status === InvoiceStatus.PAID);
    const pendingAmount = pendingInvoices.reduce((sum, invoice) => sum + parseFloat(invoice.amount.toString()), 0);
    const completedAmount = completedInvoices.reduce((sum, invoice) => sum + parseFloat(invoice.amount.toString()), 0);

    return {
      userId: userId || null, // Return null when userId is not provided
      reportsCount: invoices.length,
      totalAmount,
      pendingCount: pendingInvoices.length,
      pendingAmount,
      completedCount: completedInvoices.length,
      completedAmount,
      startDate: startDate ? startDate : undefined,
      endDate: endDate ? endDate : undefined
    };
  }
}
