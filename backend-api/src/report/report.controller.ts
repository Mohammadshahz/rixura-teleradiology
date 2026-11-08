import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Query,
  Req,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportCommentService } from './services/report-comment.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { FilterReportDto } from './dto/filter-report.dto';
import { PaginatedReportDto } from './dto/paginated-report.dto';
import { UpdateReportWithFilesDto } from './dto/update-report-with-files.dto';
import { ReportStatus } from './enums/report-status.enum';
import {  FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBearerAuth, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { UploadBulkReportDto } from './dto/upload-bulk-report.dto';
import { ChangeReportStatusDto } from './dto/change-report-status.dto';
import { ReportStatusParamsDto } from './dto/report-status-params.dto';
import { GetReportDto } from './dto/get-report.dto';
import { GenerateReportContentDto } from './dto/generate-report-content.dto';
import { UpdateReportTitleDto } from './dto/update-report-title.dto';
import { ReportIdParamDto } from './dto/report-id-param.dto';
import { UpdateReportRadiologistStatusDto } from './dto/update-report-radiologist-status.dto';

@ApiTags('Reports')
@Controller('reports')
@ApiBearerAuth()
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
    private readonly reportCommentService: ReportCommentService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new report' })
  @ApiResponse({ status: 201, description: 'Report created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createReportDto: CreateReportDto) {
    return this.reportService.create(createReportDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all reports with optional filters and pagination',
    description: 'Returns a paginated list of reports. Supports filtering by various fields including status (IDLE, ACCEPTED, REPORTED, REVERTED) and pagination parameters.'
  })
  @ApiQuery({ name: 'status', enum: ReportStatus, required: false, description: 'Filter reports by status' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated reports with metadata',
    type: PaginatedReportDto
  })
  findAll(@Query() filterDto: FilterReportDto): Promise<PaginatedReportDto> {
    return this.reportService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific report with unread comments count' })
  @ApiParam({ name: 'id', description: 'Report ID in UUID format' })
  @ApiResponse({ status: 200, description: 'Return the report with unread comments count', type: GetReportDto })
  @ApiResponse({ status: 400, description: 'Invalid report ID format' })
  @ApiResponse({ status: 404, description: 'Report not found' })
  async findOne(@Param() params: ReportIdParamDto): Promise<GetReportDto> {
    const report = await this.reportService.findOne(params.id);
    const unreadCommentsCount = await this.reportCommentService.getUnreadCountForReport(params.id);
    
    return {
      ...report,
      unreadCommentsCount
    };
  }

  
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files', 10)) // Allow up to 10 files
  @ApiOperation({
    summary: 'Update a report with optimized file processing',
    description: 'Update a report with optional file uploads. Only changes in files are processed - ' +
    'removed files are deleted from S3, and only new files are uploaded. ' +
    'Files will be stored in the AWS S3 bucket under reports/{centerId}/{reportId}/ folder structure. ' +
    'Only users with RADIOLOGIST, ADMIN, or SUPER_ADMIN roles can update reports.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Report metadata and optional files to update',
    type: UpdateReportWithFilesDto
  })
  @ApiResponse({ status: 200, description: 'Report updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid files or data or report ID format' })
  @ApiResponse({ status: 404, description: 'Report not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only radiologists, admins, or super admins can update reports' })
  updateReports(
    @Param() params: ReportIdParamDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateReportDto: UpdateReportDto,
  ) {
    return this.reportService.updateReports(params.id, updateReportDto, files);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a report' })
  @ApiParam({ name: 'id', description: 'Report ID in UUID format' })
  @ApiResponse({ status: 204, description: 'Report deleted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid report ID format' })
  @ApiResponse({ status: 404, description: 'Report not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param() params: ReportIdParamDto) {
    return this.reportService.remove(params.id);
  }

  @Post('bulk-upload')
  @UseInterceptors(FilesInterceptor('files', 10)) // Allow up to 10 files
  @ApiOperation({ 
    summary: 'Bulk upload multiple report files and create a single report entry',
    description: 'Upload multiple medical report files (DICOM, DCM, PNG, JPG) to S3 storage and create a database record. ' +
    'Files will be stored in the AWS S3 bucket under reports/{centerId}/{reportId}/ folder structure. ' +
    'The reportId is generated when the report is created, and all files are associated with this single report. ' +
    'Only users with RADIOLOGIST, ADMIN, or SUPER_ADMIN roles can upload reports.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Multiple report files upload with metadata',
    type: UploadBulkReportDto,
  })
  @ApiResponse({ status: 201, description: 'Reports uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid files or data' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only radiologists, admins, or super admins can upload reports' })
  uploadBulkReports(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createReportDto: CreateReportDto,
  ) {
    return this.reportService.uploadBulkReports(files, createReportDto);
  }

  @Patch(':id/user/:userId/status')
  @ApiOperation({
    summary: 'Change the status of a report',
    description: 'Updates only the status of a report. This is more efficient than a full report update when only ' +
      'the status needs to be changed. When a report is marked as REPORTED, the system tracks who reported it and when. ' +
      'Only users with RADIOLOGIST, ADMIN, or SUPER_ADMIN roles can change report status.'
  })
  @ApiParam({ name: 'id', description: 'Report ID' })
  @ApiParam({ name: 'userId', description: 'User ID of the user making the change', required: true })
  @ApiBody({
    description: 'New status for the report',
    type: ChangeReportStatusDto,
  })
  @ApiResponse({ status: 200, description: 'Report status updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions or not your report' })
  @ApiResponse({ status: 404, description: 'Report not found' })
  changeStatus(
    @Param() params: ReportStatusParamsDto,
    @Body() changeStatusDto: ChangeReportStatusDto,
  ) {
    return this.reportService.changeStatus(params.id, changeStatusDto, params.userId);
  }
  
  @Patch(':id/user/:userId/generate-content')
  @ApiOperation({
    summary: 'Generate AI content for a report',
    description: 'Updates only the reportGeneratedContent field of a report. The report must be in ACCEPTED status. ' +
      'For radiologists, they can only generate content for reports assigned to them.'
  })
  @ApiParam({ name: 'id', description: 'Report ID in UUID format' })
  @ApiParam({ name: 'userId', description: 'User ID of the radiologist making the change', required: true })
  @ApiBody({
    description: 'Generated content for the report',
    type: GenerateReportContentDto,
  })
  @ApiResponse({ status: 200, description: 'Report content generated successfully', type: GetReportDto })
  @ApiResponse({ status: 400, description: 'Bad Request - Report not in ACCEPTED status or invalid ID format' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions or not your report' })
  @ApiResponse({ status: 404, description: 'Report not found' })
  async generateReportContent(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() generateReportContentDto: GenerateReportContentDto
  ): Promise<GetReportDto> {
    // Validate UUID format before proceeding
    const reportIdParam = new ReportIdParamDto();
    reportIdParam.id = id;
    
    const report = await this.reportService.generateReportContent(id, generateReportContentDto, userId);
    
    // Add unread comments count to report before returning
    const unreadCommentsCount = await this.reportCommentService.getUnreadCountForReport(report.id);
    
    return {
      ...report,
      unreadCommentsCount
    };
  }
  
  @Patch(':id/title')
  @ApiOperation({
    summary: 'Update only the title of a report',
    description: 'Updates only the title of a report. This is more efficient than a full report update when only the title needs to be changed.'
  })
  @ApiParam({ name: 'id', description: 'Report ID in UUID format' })
  @ApiBody({
    description: 'New title for the report',
    type: UpdateReportTitleDto,
  })
  @ApiResponse({ status: 200, description: 'Report title updated successfully', type: GetReportDto })
  @ApiResponse({ status: 400, description: 'Invalid report ID format' })
  @ApiResponse({ status: 404, description: 'Report not found' })
  async updateReportTitle(
    @Param() params: ReportIdParamDto,
    @Body() updateReportTitleDto: UpdateReportTitleDto
  ): Promise<GetReportDto> {
    const report = await this.reportService.updateReportTitle(params.id, updateReportTitleDto);
    
    // Add unread comments count to report before returning
    const unreadCommentsCount = await this.reportCommentService.getUnreadCountForReport(report.id);
    
    return {
      ...report,
      unreadCommentsCount
    };
  }

  @Post(':id/update-radiologist-status')
  @ApiOperation({
    summary: 'Update radiologist status for a report',
    description: 'Updates the radiologist status of a report and optionally removes the radiologist assignment.'
  })
  @ApiParam({ name: 'id', description: 'Report ID in UUID format' })
  @ApiBody({
    description: 'Data to update radiologist status',
    type: UpdateReportRadiologistStatusDto,
  })
  @ApiResponse({ status: 200, description: 'Radiologist status updated successfully', type: GetReportDto })
  @ApiResponse({ status: 400, description: 'Invalid report ID format' })
  @ApiResponse({ status: 404, description: 'Report not found' })
  async updateRadiologistStatus(
    @Param() params: ReportIdParamDto,
    @Body() updateReportRadiologistStatusDto: UpdateReportRadiologistStatusDto
  ): Promise<GetReportDto> {
    const report = await this.reportService.updateRadiologistStatus(params.id, updateReportRadiologistStatusDto);
    
    // Add unread comments count to report before returning
    const unreadCommentsCount = await this.reportCommentService.getUnreadCountForReport(report.id);
    
    return {
      ...report,
      unreadCommentsCount
    };
  }
}
