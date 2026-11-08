import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ReportCommentRepository } from '../repositories/report-comment.repository';
import { CreateReportCommentDto } from '../dto/create-report-comment.dto';
import { ReportComment } from '../entities/report-comment.entity';
import { ReportService } from '../report.service';
import { UserRole } from '../../user/enums/users.enum';

@Injectable()
export class ReportCommentService {
  constructor(
    private readonly reportCommentRepository: ReportCommentRepository,
    private readonly reportService: ReportService
  ) {}

  async create(createReportCommentDto: CreateReportCommentDto): Promise<ReportComment> {
    const { reportId, content, centerId, radiologistId } = createReportCommentDto;
    
    // Verify that the report exists
    const report = await this.reportService.findOne(reportId);
    if (!report) {
      throw new NotFoundException(`Report with ID ${reportId} not found`);
    }

    // Determine userType based on which ID is provided
    let userType: UserRole;

    if (centerId && radiologistId) {
      throw new BadRequestException('Cannot specify both centerId and radiologistId');
    } else if (centerId) {
      userType = UserRole.CENTER;
    } else if (radiologistId) {
      userType = UserRole.RADIOLOGIST;
    } else {
      throw new BadRequestException('Either centerId or radiologistId must be provided');
    }

    // Create the comment entity
    const comment = this.reportCommentRepository.create({
      reportId,
      content,
      userType,
      isRead: false
    });

    // Set IDs based on user type and ensure only one ID is set
    if (userType === UserRole.RADIOLOGIST) {
      comment.radiologistId = radiologistId;
      comment.centerId = null; // Explicit null for centerId when radiologistId is present
    } else if (userType === UserRole.CENTER) {
      comment.centerId = centerId;
      comment.radiologistId = null; // Explicit null for radiologistId when centerId is present
    }

    return this.reportCommentRepository.save(comment);
  }

  async findAll(reportId: string): Promise<ReportComment[]> {
    return this.reportCommentRepository.findByReportId(reportId);
  }

  async findOne(id: string): Promise<ReportComment> {
    const comment = await this.reportCommentRepository.findOne(id);
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    return comment;
  }

  async markAsRead(id: string, userId: string): Promise<void> {
    const comment = await this.findOne(id);
    await this.reportCommentRepository.markAsRead(id, userId);
  }

  async markAllAsReadForReport(reportId: string): Promise<void> {
    await this.reportCommentRepository.markAllAsReadForReport(reportId);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // Check if comment exists
    return this.reportCommentRepository.remove(id);
  }

  async getUnreadCount(userId: string, userRole: UserRole): Promise<number> {
    return this.reportCommentRepository.countUnreadByUserAndType(userId, userRole);
  }
  
  async getUnreadCountForReport(reportId: string): Promise<number> {
    return this.reportCommentRepository.countUnreadForReport(reportId);
  }
}
