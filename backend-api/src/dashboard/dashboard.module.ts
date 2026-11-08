import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Report } from '../report/entities/report.entity';
import { Invoice } from '../invoice/entities/invoice.entity';
import { User } from '../user/entities/user.entity';
import { Center } from '../center/entities/center.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Report,
      Invoice,
      User,
      Center
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
