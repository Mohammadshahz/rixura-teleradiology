import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportComment } from '../entities/report-comment.entity';
import { UserRole } from '../../user/enums/users.enum';

@Injectable()
export class ReportCommentRepository {
  constructor(
    @InjectRepository(ReportComment)
    private readonly repository: Repository<ReportComment>,
  ) {}

  async findByReportId(reportId: string): Promise<ReportComment[]> {
    return this.repository.find({
      where: { reportId },
      relations: ['center', 'radiologist'],
      order: { createdAt: 'DESC' }
    });
  }
  
  async markAsRead(commentId: string, userId: string): Promise<void> {
    await this.repository.update(
      { id: commentId, isRead: false },
      { 
        isRead: true,
        readAt: new Date()
      }
    );
  }
  
  async markAllAsReadForReport(reportId: string): Promise<void> {
    // Mark all unread comments for this report as read
    await this.repository
      .createQueryBuilder()
      .update()
      .set({ 
        isRead: true,
        readAt: new Date() 
      })
      .where('reportId = :reportId', { reportId })
      .andWhere('isRead = :isRead', { isRead: false })
      .execute();
  }
  
  create(data: Partial<ReportComment>): ReportComment {
    return this.repository.create(data);
  }
  
  save(comment: ReportComment): Promise<ReportComment> {
    return this.repository.save(comment);
  }
  
  findOne(id: string): Promise<ReportComment> {
    return this.repository.findOne({ 
      where: { id },
      relations: ['center', 'radiologist']
    });
  }
  
  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
  
  async countUnreadByUserAndType(userId: string, userType: string): Promise<number> {
    // Find the opposing user type to count unread comments
    const opposingUserType = userType === UserRole.RADIOLOGIST ? UserRole.CENTER : UserRole.RADIOLOGIST;
    
    return this.repository.count({
      where: {
        isRead: false,
        userType: opposingUserType,
        ...(userType === UserRole.RADIOLOGIST ? { radiologistId: userId } : { centerId: userId })
      }
    });
  }
  
  async countUnreadForReport(reportId: string): Promise<number> {
    return this.repository.count({
      where: {
        reportId,
        isRead: false
      }
    });
  }
}
