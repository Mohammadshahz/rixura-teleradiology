import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { InvoiceService } from '../services/invoice.service';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';
import { UpdateInvoiceDto } from '../dto/update-invoice.dto';
import { FilterInvoiceDto } from '../dto/filter-invoice.dto';
import { InvoiceSummaryQueryDto, InvoiceSummaryResponseDto } from '../dto/invoice-summary.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { Invoice } from '../entities/invoice.entity';
import { PaginationResponseDto } from '../../common/dto/pagination-response.dto';

@ApiTags('invoices')
@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new invoice' })
  @ApiBody({ type: CreateInvoiceDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The invoice has been successfully created',
    type: Invoice,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  create(@Body() createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    return this.invoiceService.create(createInvoiceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all invoices with optional filtering and pagination' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns invoices matching the filter criteria, with optional pagination',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Invoice' },
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            pagination: { type: 'boolean', description: 'Whether pagination is enabled' },
            page: { type: 'number', description: 'Current page (only when pagination is true)' },
            limit: { type: 'number', description: 'Items per page (only when pagination is true)' },
            pages: { type: 'number', description: 'Total pages (only when pagination is true)' },
            hasNextPage: { type: 'boolean', description: 'Whether there is a next page (only when pagination is true)' },
            hasPreviousPage: { type: 'boolean', description: 'Whether there is a previous page (only when pagination is true)' },
          }
        }
      },
    },
  })
  findAll(@Query() filterDto: FilterInvoiceDto): Promise<PaginationResponseDto<Invoice>> {
    return this.invoiceService.findAll(filterDto);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get invoice summary statistics for a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns aggregated invoice statistics for the specified user',
    type: InvoiceSummaryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input parameters or missing required userId',
  })
  getSummary(@Query() summaryQueryDto: InvoiceSummaryQueryDto): Promise<InvoiceSummaryResponseDto> {
    return this.invoiceService.getSummary(summaryQueryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an invoice by id' })
  @ApiParam({ name: 'id', description: 'Invoice ID', type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the invoice with the specified id',
    type: Invoice,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Invoice not found',
  })
  findOne(@Param('id') id: string): Promise<Invoice> {
    return this.invoiceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an invoice' })
  @ApiParam({ name: 'id', description: 'Invoice ID', type: 'string' })
  @ApiBody({ type: UpdateInvoiceDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The invoice has been successfully updated',
    type: Invoice,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Invoice not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  update(
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<Invoice> {
    return this.invoiceService.update(id, updateInvoiceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an invoice' })
  @ApiParam({ name: 'id', description: 'Invoice ID', type: 'string' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The invoice has been successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Invoice not found',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.invoiceService.remove(id);
  }
}
