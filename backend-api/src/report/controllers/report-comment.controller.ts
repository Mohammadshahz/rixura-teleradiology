import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Query, Put, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../user/enums/users.enum';
import { ReportCommentService } from '../services/report-comment.service';
import { CreateReportCommentDto } from '../dto/create-report-comment.dto';
import { ReportComment } from '../entities/report-comment.entity';
import { GetReportCommentsDto } from '../dto/get-report-comments.dto';

@ApiTags('Report Comments')
@Controller('report-comments')
@ApiBearerAuth()
export class ReportCommentController {
  constructor(private readonly reportCommentService: ReportCommentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new comment on a report' })
  @ApiResponse({ status: 201, description: 'Comment created successfully', type: ReportComment })
  async create(@Body() createReportCommentDto: CreateReportCommentDto) {
    return this.reportCommentService.create(createReportCommentDto);
  }

  @Get('report/:reportId')
  @ApiOperation({ summary: 'Get all comments for a specific report' })
  @ApiResponse({ status: 200, description: 'Return all comments for the report', type: [ReportComment] })
  async findAllForReport(@Param('reportId', ParseUUIDPipe) reportId: string) {
    const comments = await this.reportCommentService.findAll(reportId);
    
    // Mark all comments as read (if needed)
    await this.reportCommentService.markAllAsReadForReport(reportId);
    
    return comments;
  }

  @Get('report/:reportId/unread-count')
  @ApiOperation({ summary: 'Get count of unread comments for a specific report' })
  @ApiResponse({ status: 200, description: 'Return count of unread comments for the report' })
  async getUnreadCountForReport(@Param('reportId', ParseUUIDPipe) reportId: string) {
    const count = await this.reportCommentService.getUnreadCountForReport(reportId);
    return { unreadCount: count };
  }

  @Put(':id/mark-read')
  @ApiOperation({ summary: 'Mark a specific comment as read' })
  @ApiResponse({ status: 200, description: 'Comment marked as read successfully' })
  async markAsRead(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    await this.reportCommentService.markAsRead(id, req.user.userId);
    return { success: true, message: 'Comment marked as read' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.reportCommentService.remove(id);
    return { success: true, message: 'Comment deleted successfully' };
  }
}
