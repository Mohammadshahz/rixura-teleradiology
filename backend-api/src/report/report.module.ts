import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { Report } from './entities/report.entity';
import { ReportComment } from './entities/report-comment.entity';
import { S3Service } from '../aws/s3.service';
import { ReportCommentService } from './services/report-comment.service';
import { ReportCommentRepository } from './repositories/report-comment.repository';
import { ReportCommentController } from './controllers/report-comment.controller';
import { User } from '../user/entities/user.entity';
import { Invoice } from '../invoice/entities/invoice.entity';
import { Center } from '../center/entities/center.entity';
import { UserCenter } from '../center/entities/user-center.entity';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [TypeOrmModule.forFeature([Report, ReportComment, User, Invoice, Center, UserCenter])],
  controllers: [ReportController, ReportCommentController],
  providers: [ReportService, S3Service, ReportCommentService, ReportCommentRepository, ConfigService],
  exports: [ReportService, ReportCommentService],
})
export class ReportModule {}
