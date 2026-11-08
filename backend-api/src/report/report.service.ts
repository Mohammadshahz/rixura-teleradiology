import { Injectable, BadRequestException, NotFoundException, ForbiddenException, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ChangeReportStatusDto } from './dto/change-report-status.dto';
import { FilterReportDto } from './dto/filter-report.dto';
import { ReportStatus } from './enums/report-status.enum';
import { ReportType } from './enums/report-type.enum';
import { XRayType } from './enums/x-ray-type.enum';
import { S3Service } from '../aws/s3.service';
import { GenerateReportContentDto } from './dto/generate-report-content.dto';
import { PaginationMetaDto } from '../common/dto/pagination-meta.dto';
import { PaginatedReportDto } from './dto/paginated-report.dto';
import { User } from '../user/entities/user.entity';
import { UserRole } from '../user/enums/user-role.enum';
import { Invoice } from '../invoice/entities/invoice.entity';
import { InvoiceStatus } from '../invoice/enums/invoice-status.enum';
import { InvoiceReportType } from '../invoice/enums/invoice-report-type.enum';
import { Center } from '../center/entities/center.entity';
import { UserCenter } from '../center/entities/user-center.entity';
import { DEFAULT_PRICES, getDefaultPrice } from '../config/pricing.config';
import { UpdateReportRadiologistStatusDto } from './dto/update-report-radiologist-status.dto';

@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(Center)
    private centerRepository: Repository<Center>,
    @InjectRepository(UserCenter)
    private userCenterRepository: Repository<UserCenter>,
    private readonly s3Service: S3Service,
    private readonly configService: ConfigService,
  ) {}

  async create(createReportDto: CreateReportDto): Promise<Report> {
    const report = this.reportRepository.create({
      ...createReportDto,
      reportUrls: [] // Initialize with empty array
    });
    return this.reportRepository.save(report);
  }

  async findAll(filterDto: FilterReportDto): Promise<PaginatedReportDto> {
    const query = this.reportRepository.createQueryBuilder('report');
    
    // We'll join the radiologist relation later in the query
    
    // Apply filters
    if (filterDto.centerId) {
      query.andWhere('report.centerId = :centerId', { centerId: filterDto.centerId });
    }
    
    if (filterDto.centerCode) {
      // Join center to access centerCode
      query.innerJoin('report.center', 'centerFilter');
      query.andWhere('centerFilter.code LIKE :centerCode', { centerCode: `%${filterDto.centerCode}%` });
    }
    
    if (filterDto.patientId) {
      query.andWhere('report.patientId = :patientId', { patientId: filterDto.patientId });
    }
    
    if (filterDto.radiologistId) {
      query.andWhere('report.radiologistId = :radiologistId', { radiologistId: filterDto.radiologistId });
    }
    
    if (filterDto.radiologistName) {
      // Join radiologist here but with an alias to prevent conflicts
      query.innerJoin('report.radiologist', 'radiologistFilter');
      // Use ILike for case insensitive search
      query.andWhere('radiologistFilter.name ILIKE :radiologistName', { radiologistName: `%${filterDto.radiologistName}%` });
    }
    
    if (filterDto.xRayType) {
      query.andWhere('report.xRayType = :xRayType', { xRayType: filterDto.xRayType });
    }
    
    if (filterDto.reportType) {
      query.andWhere('report.reportType = :reportType', { reportType: filterDto.reportType });
    }
    
    if (filterDto.title) {
      query.andWhere('report.title ILIKE :title', { title: `%${filterDto.title}%` });
    }
    
    if (filterDto.status) {
      query.andWhere('report.status = :status', { status: filterDto.status });
    }
    
    // Apply date range filters if provided
    if (filterDto.startDate) {
      const startDate = new Date(filterDto.startDate);
      // Set to beginning of the day (00:00:00)
      startDate.setHours(0, 0, 0, 0);
      query.andWhere('report.createdAt >= :startDate', { startDate });
    }
    
    if (filterDto.endDate) {
      const endDate = new Date(filterDto.endDate);
      // Set to end of the day (23:59:59.999)
      endDate.setHours(23, 59, 59, 999);
      query.andWhere('report.createdAt <= :endDate', { endDate });
    }
    
    // Get total count before pagination
    const total = await query.getCount();
    
    // Set default values for pagination parameters if not provided
    const page = filterDto.page || 1;
    const limit = filterDto.limit || 10;
    const skip = (page - 1) * limit;
    
    // Apply pagination
    query
      .skip(skip)
      .take(limit)
      .leftJoinAndSelect('report.center', 'center')
      .leftJoinAndSelect('report.patient', 'patient')
      .leftJoinAndSelect('report.radiologist', 'radiologist')
      .orderBy('report.createdAt', 'DESC'); // Default sorting by creation date, newest first
    
    // Execute query
    const reports = await query.getMany();
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    
    // Create pagination metadata
    const meta = new PaginationMetaDto();
    meta.total = total;
    meta.page = page;
    meta.limit = limit;
    meta.totalPages = totalPages;
    meta.hasPreviousPage = page > 1;
    meta.hasNextPage = page < totalPages;
    
    // Return paginated response
    const response = new PaginatedReportDto();
    response.data = reports;
    response.meta = meta;
    
    return response;
  }

  async findOne(id: string): Promise<Report> {
    const report = await this.reportRepository.findOne({
      where: { id },
      relations: ['center', 'patient', 'radiologist', 'template'],
    });

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
    
    // Add signed URLs to the report
    await this.addSignedUrlsToReport(report);

    return report;
  }
  
  /**
   * Generate or update AI content for a report
   * @param id Report ID
   * @param generateReportContentDto DTO containing generated content
   * @param userId User ID of the radiologist performing the operation
   * @returns Updated report object
   */
  async generateReportContent(id: string, generateReportContentDto: GenerateReportContentDto, userId: string): Promise<Report> {
    // Find report with radiologist
    const report = await this.reportRepository.findOne({
      where: { id },
      relations: ['radiologist'],
    });

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
    
    // // Check if report is in ACCEPTED status
    // if (report.status !== ReportStatus.ACCEPTED) {
    //   throw new BadRequestException(`Cannot generate content for a report that is not in ACCEPTED status. Current status: ${report.status}`);
    // }
    
    // Check if user is the assigned radiologist
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    
    if (user.role === UserRole.RADIOLOGIST && report.radiologistId !== userId) {
      throw new ForbiddenException('Radiologists can only generate content for reports assigned to them');
    }
    
    // Update report with generated content
    report.reportGeneratedContent = generateReportContentDto.reportGeneratedContent;
    
    // Update templateId if provided
    if (generateReportContentDto.templateId) {
      report.templateId = generateReportContentDto.templateId;
    }
    
    // Save and return updated report
    return this.reportRepository.save(report);
  }

  async update(id: string, updateReportDto: UpdateReportDto): Promise<Report> {
    const report = await this.findOne(id);
    
    Object.assign(report, updateReportDto);
    
    return this.reportRepository.save(report);
  }

  /**
   * Update a report with new files, optimizing by only uploading changed files
   * @param id - Report ID
   * @param updateReportDto - Data for updating the report
   * @param files - New files to be uploaded
   * @returns Updated report
   */
  async updateReports(
    id: string, 
    updateReportDto: UpdateReportDto, 
    files: Express.Multer.File[]
  ): Promise<Report> {
    // Find existing report
    const report = await this.findOne(id);
    
    // Create a safe copy of the existing report URLs
    const existingReportUrls = report.reportUrls || [];
    
    // Process report URLs if they're explicitly provided in the DTO
    if (updateReportDto.reportUrls) {
      // Get arrays for comparison
      const desiredReportUrls = updateReportDto.reportUrls;
      
      // Find URLs that need to be deleted (exist in database but not in the DTO)
      const urlsToDelete = existingReportUrls.filter(url => !desiredReportUrls.includes(url));
      
      // Delete files from S3 that are no longer needed
      for (const urlToDelete of urlsToDelete) {
        await this.s3Service.deleteFile(urlToDelete);
        console.log(`Deleting removed file: ${urlToDelete}`);
      }
      
      // The report will be updated with the exact reportUrls from the DTO plus any newly uploaded files
    }
    
    // Store the final list of report URLs (either from DTO or keeping existing ones)
    let finalReportUrls = updateReportDto.reportUrls ? [...updateReportDto.reportUrls] : [...existingReportUrls];
    
    // Check if there are new files to process and upload
    if (files && files.length > 0) {
      // Validate file types for all files
      for (const file of files) {
        this.validateFileType(file);
      }
      
      // Upload all new files to S3
      for (const file of files) {
        // Generate a unique name by using timestamp and original filename
        const uniqueFileName = `${report.id}-${updateReportDto.title || report.title}-${Date.now()}-${file.originalname}`;
        
        // Generate file key with unique name to avoid collisions
        const fileKey = this.generateS3FileKey(
          report.centerId,
          report.id,
          uniqueFileName,
          file.originalname
        );
        
        // Upload to S3
        await this.s3Service.uploadFile(
          file.buffer,
          fileKey,
          file.mimetype
        );
        
        // Add the new file URL to our final list
        finalReportUrls.push(fileKey);
        console.log(`Uploaded new file: ${file.originalname} as ${fileKey}`);
      }
    }
    
    // Update report data fields (except reportUrls which we handle separately)
    const { reportUrls, ...otherFields } = updateReportDto;
    Object.assign(report, otherFields);
    
    // Set the final report URLs
    report.reportUrls = finalReportUrls;
    
    // Save and return the updated report
    return this.reportRepository.save(report);
  }

  async remove(id: string): Promise<void> {
    const report = await this.findOne(id);
    
    // Delete files from S3 if they exist
    if (report.reportUrls && report.reportUrls.length > 0) {
      for (const url of report.reportUrls) {
        await this.s3Service.deleteFile(url);
      }
    }
    
    await this.reportRepository.remove(report);
  }
  
  async uploadReport(
    file: Express.Multer.File,
    createReportDto: CreateReportDto,
  ): Promise<Report> {
    // Check if user is a radiologist or admin

    // Validate file type
    this.validateFileType(file);
    
    // Create report in database first to get the ID
    const report = this.reportRepository.create({
      ...createReportDto,
      reportUrls: [],
    });
    
    const savedReport = await this.reportRepository.save(report);
    
    // Generate file key
    const fileKey = this.generateS3FileKey(
      createReportDto.centerId,
      savedReport.id,
      createReportDto.title,
      file.originalname
    );
    
    // Upload to S3
    await this.s3Service.uploadFile(
      file.buffer,
      fileKey,
      file.mimetype
    );
    
    // Update report with file URL
    savedReport.reportUrls = [fileKey];
    
    return this.reportRepository.save(savedReport);
  }
  
  async uploadBulkReports(
    files: Express.Multer.File[],
    createReportDto: CreateReportDto,
  ): Promise<Report> {
    // Check if files array is not empty
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided for upload');
    }
    
    // Validate file types for all files
    for (const file of files) {
      this.validateFileType(file);
    }
    
    // Create report in database first to get the ID
    const report = this.reportRepository.create({
      ...createReportDto,
      reportUrls: [],
    });
    
    const savedReport = await this.reportRepository.save(report);
    
    // Upload each file to S3 and collect the keys
    const fileKeys: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Generate a more unique name by using timestamp and original filename
      const uniqueFileName = `${savedReport.id}-${createReportDto.title}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      
      // Generate file key with unique name to avoid collisions
      const fileKey = this.generateS3FileKey(
        createReportDto.centerId,
        savedReport.id,
        uniqueFileName,
        file.originalname
      );
      
      // Upload to S3
      await this.s3Service.uploadFile(
        file.buffer,
        fileKey,
        file.mimetype
      );
      
      fileKeys.push(fileKey);
    }
    
    // Update report with file URLs
    savedReport.reportUrls = fileKeys;
    
    return this.reportRepository.save(savedReport);
  }
  
  async getSignedReportUrl(reportId: string): Promise<string[]> {
    const report = await this.findOne(reportId);
    
    if (!report.reportUrls || report.reportUrls.length === 0) {
      return [];
    }
    
    const signedUrls = await Promise.all(
      report.reportUrls.map(url => this.s3Service.getSignedUrl(url))
    );
    
    return signedUrls;
  }
  
  /**
   * Helper method to add signed URLs to a report object
   * @param report - The report object to add signed URLs to
   */
  private async addSignedUrlsToReport(report: Report): Promise<void> {
    if (report.reportUrls && report.reportUrls.length > 0) {
      const signedReportUrls = [];
      for (const url of report.reportUrls) {
        try {
          const signedUrl = await this.s3Service.getSignedUrl(url);
          signedReportUrls.push({
            key: url,
            signedUrl: signedUrl
          });
        } catch (error) {
          console.error(`Failed to generate signed URL for ${url}:`, error);
          signedReportUrls.push({
            key: url,
            signedUrl: null,
            error: 'Failed to generate signed URL'
          });
        }
      }
      // Add the signed URLs to the report
      report['signedReportUrls'] = signedReportUrls;
    } else {
      report['signedReportUrls'] = [];
    }
  }
  
  /**
   * Helper method to validate file mime type
   * @param file - The file to validate
   * @throws BadRequestException if file type is not allowed
   */
  private validateFileType(file: Express.Multer.File): void {
    const allowedMimeTypes = [
      'image/jpeg', 'image/png', 'image/dicom', 
      'application/dicom', 'application/octet-stream'
    ];
    
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type not allowed for ${file.originalname}. Only DICOM, JPEG, or PNG files are allowed.`
      );
    }
  }
  
  /**
   * Helper method to generate S3 file key
   * @param centerId - The center ID
   * @param reportId - The report ID
   * @param baseFileName - The base file name
   * @param originalFileName - The original file name (for extension)
   * @returns The generated S3 file key
   */
  private generateS3FileKey(
    centerId: string,
    reportId: string,
    baseFileName: string,
    originalFileName: string
  ): string {
    // Replace invalid characters with hyphens
    const sanitizedFileName = baseFileName.replace(/[^a-zA-Z0-9-]/g, '-');
    
    // Add file extension from original file if available
    const fileExtension = originalFileName.split('.').pop();
    const fullFileName = fileExtension ? `${sanitizedFileName}.${fileExtension}` : sanitizedFileName;
    
    // Return the full S3 key with the structure: reports/{centerId}/{reportId}/{fileName}
    return `reports/${centerId}/${reportId}/${fullFileName}`;
  }
  
  /**
   * Update only the title of a report
   * @param id - Report ID
   * @param updateReportTitleDto - DTO containing only the title field
   * @returns Updated report
   */
  async updateReportTitle(id: string, updateReportTitleDto: { title: string }): Promise<Report> {
    const report = await this.findOne(id);
    
    // Update only the title field
    report.title = updateReportTitleDto.title;
    
    // Save and return the updated report
    const updatedReport = await this.reportRepository.save(report);
    
    // Add signed URLs to the report response
    await this.addSignedUrlsToReport(updatedReport);
    
    return updatedReport;
  }

  /**
   * Change the status of a report
   * @param id - Report ID
   * @param statusDto - Data containing the new report status
   * @param userId - ID of the user making the change
   * @returns Updated report
   */
  async changeStatus(id: string, statusDto: ChangeReportStatusDto, userId: string): Promise<Report> {
    // Find existing report
    const report = await this.findOne(id);
    
    // Get user information from repository
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Authorization checks based on user role
    // Allow radiologists to change status if any of these conditions are met:
    // 1. The report has no radiologist assigned
    // 2. They are the assigned radiologist
    if (user.role === UserRole.RADIOLOGIST && report.radiologistId !== null && report.radiologistId !== user.id) {
      throw new ForbiddenException('Radiologists can only change status of reports assigned to them or unassigned reports');
    }
    
    // If user has CENTER role, verify they belong to the center that owns the report
    if (user.role === UserRole.CENTER) {
      // Find if the user is associated with the report's center
      const userCenter = await this.userCenterRepository.findOne({
        where: {
          user: { id: userId },
          center: { id: report.centerId }
        },
        relations: ['user', 'center']
      });
      
      if (!userCenter) {
        throw new ForbiddenException('Center users can only change status of reports from their associated centers');
      }
    }
    
    // ADMIN role doesn't need additional checks - they can update any report
    
    // If the report is IDLE, radiologistId is null, user is RADIOLOGIST and status is changing to ACCEPTED
    // then assign this radiologist to the report
    if (report.status === ReportStatus.IDLE && 
        report.radiologistId === null && 
        user.role === UserRole.RADIOLOGIST && 
        statusDto.status === ReportStatus.ACCEPTED) {
      report.radiologistId = userId;
    }
    
    // Update the report status
    report.updatedAt = new Date();
    
    // If changing to REPORTED status, record who reported it and when
    if (statusDto.status === ReportStatus.REPORTED) {
      report.reportedAt = new Date();
      await this.createInvoicesForCompletedReport(report);
      // Store the radiologist who reported it
      report.radiologistId = userId;
    }
    
    // // If changing to COMPLETED status, create invoice entries
    // if (statusDto.status === ReportStatus.COMPLETED) {
    //   await this.createInvoicesForCompletedReport(report);
    // }

    // If changing to REVERTED status, clear the reportedAt
    if (statusDto.status === ReportStatus.REVERTED) {
      report.reportedAt = null;
    }
    report.status = statusDto.status;
    
    // Save the updated report
    const updatedReport = await this.reportRepository.save(report);
    
    return updatedReport;
  }
  


  /**
   * Creates invoice entries for a completed report
   * @param report - The completed report
   */
  private async createInvoicesForCompletedReport(report: Report): Promise<void> {
    try {
      // Get center from the report
      const center = await this.centerRepository.findOne({
        where: { id: report.centerId }
      });
      
      if (!center) {
        throw new NotFoundException(`Center with ID ${report.centerId} not found`);
      }

      // Find center user through user-center relationship
      const userCenter = await this.userCenterRepository.findOne({
        where: { center: { id: center.id } },
        relations: ['user']
      });

      if (!userCenter || !userCenter.user) {
        throw new NotFoundException(`No user found for center with ID ${center.id}`);
      }

      const centerUser = userCenter.user;

      if (centerUser.role !== UserRole.CENTER) {
        console.warn(`User ${centerUser.id} for center ${center.id} does not have CENTER role`);
      }

      // Find radiologist user
      const radiologistUser = await this.userRepository.findOne({
        where: { id: report.radiologistId }
      });

      if (!radiologistUser) {
        throw new NotFoundException(`Radiologist with ID ${report.radiologistId} not found`);
      }

      // Using centralized pricing configuration for default prices

      // Create invoice for center
      const centerInvoice = this.invoiceRepository.create({
        userId: centerUser.id,
        userType: UserRole.CENTER,
        reportId: report.id,
        xRayType: report.xRayType,
        status: InvoiceStatus.PENDING,
        // Set invoiceReportType based on report status
        invoiceReportType: report.status === ReportStatus.REVERTED
          ? InvoiceReportType.REVIEW
          : InvoiceReportType.REGULAR,
        // Use regular price for REPORTED status and review price for REVERTED status
        amount: report.status === ReportStatus.REVERTED
          ? (centerUser.prices?.[report.xRayType]?.review || getDefaultPrice(report.xRayType, UserRole.CENTER, true))
          : (centerUser.prices?.[report.xRayType]?.regular || getDefaultPrice(report.xRayType, UserRole.CENTER, false))
      });

      // Create invoice for radiologist
      const radiologistInvoice = this.invoiceRepository.create({
        userId: radiologistUser.id,
        userType: UserRole.RADIOLOGIST,
        reportId: report.id,
        xRayType: report.xRayType,
        status: InvoiceStatus.PENDING,
        // Set invoiceReportType based on report status
        invoiceReportType: report.status === ReportStatus.REVERTED
          ? InvoiceReportType.REVIEW
          : InvoiceReportType.REGULAR,
        // Use regular price for REPORTED status and review price for REVERTED status
        // Apply tax deduction to radiologist amount
        amount: this.calculateRadiologistAmount(
          report.status === ReportStatus.REVERTED
            ? (radiologistUser.prices?.[report.xRayType]?.review || getDefaultPrice(report.xRayType, UserRole.RADIOLOGIST, true))
            : (radiologistUser.prices?.[report.xRayType]?.regular || getDefaultPrice(report.xRayType, UserRole.RADIOLOGIST, false))
        )
      });

      // Save both invoices
      await this.invoiceRepository.save([centerInvoice, radiologistInvoice]);
    } catch (error) {
      console.error('Failed to create invoices for completed report:', error);
      // Don't block the status change if invoice creation fails
      // Just log the error for troubleshooting
    }
  }

  /**
   * Calculates the radiologist amount after applying tax deduction
   * @param originalAmount - The original amount before tax deduction
   * @returns The amount after tax deduction
   */
  private calculateRadiologistAmount(originalAmount: number): number {
    const taxDeductionPercentage = this.configService.radiologistTaxDeduction;
    const deductionMultiplier = (100 - taxDeductionPercentage) / 100;
    return originalAmount * deductionMultiplier;
  }

  /**
   * Updates the radiologist status of a report and optionally removes the radiologist assignment
   * @param id - Report ID
   * @param updateReportRadiologistStatusDto - DTO with status and removeRadiologist flag
   * @returns The updated report
   */
  async updateRadiologistStatus(id: string, updateReportRadiologistStatusDto: UpdateReportRadiologistStatusDto): Promise<Report> {
    this.logger.log(`Updating radiologist status for report ${id}`); 
    
    // Find the report
    const report = await this.reportRepository.findOne({
      where: { id },
      relations: ['center', 'patient', 'radiologist'],
    });

    if (!report) {
      this.logger.error(`Report with ID ${id} not found when updating radiologist status`);
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    // Update the status
    report.status = updateReportRadiologistStatusDto.status;
    this.logger.log(`Updated report ${id} status to ${report.status}`);
    
    // Check if radiologist should be removed
    if (updateReportRadiologistStatusDto.removeRadiologist) {
      // Store the previous radiologistId for logging
      const previousRadiologistId = report.radiologistId;
      
      // Remove the radiologist
      report.radiologistId = null;
      report.radiologist = null;
      
      this.logger.log(`Removed radiologist ${previousRadiologistId} from report ${id}`);
    } else if (updateReportRadiologistStatusDto.radiologistId) {
      // If a new radiologistId is provided, update it
      report.radiologistId = updateReportRadiologistStatusDto.radiologistId;
      this.logger.log(`Assigned radiologist ${report.radiologistId} to report ${id}`);
      
      // Fetch the radiologist data to keep the relation intact
      if (report.radiologistId) {
        const radiologist = await this.userRepository.findOne({ where: { id: report.radiologistId } });
        if (radiologist) {
          report.radiologist = radiologist;
        }
      }
    }

    // Save the updated report
    const savedReport = await this.reportRepository.save(report);
    this.logger.log(`Successfully updated radiologist status for report ${id}`);
    
    // Add signed URLs to the report
    await this.addSignedUrlsToReport(savedReport);

    return savedReport;
  }
}
