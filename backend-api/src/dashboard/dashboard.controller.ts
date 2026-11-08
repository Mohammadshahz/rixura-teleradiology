import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { DashboardFilterDto, TimePeriod } from './dto/dashboard-filter.dto';
import { DashboardResponseDto } from './dto/dashboard-response.dto';
import { RevenueGraphResponseDto } from './dto/revenue-graph.dto';
import { ReportsGraphResponseDto } from './dto/reports-graph.dto';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Get dashboard data with optional time period filtering' })
  @ApiQuery({ name: 'timePeriod', enum: TimePeriod, required: false, description: 'Filter dashboard data by time period' })
  @ApiResponse({ status: 200, description: 'Dashboard data retrieved successfully', type: DashboardResponseDto })
  getDashboardData(@Query() filter: DashboardFilterDto): Promise<DashboardResponseDto> {
    return this.dashboardService.getDashboardData(filter);
  }

  @Get('revenue-graph')
  @ApiOperation({ summary: 'Get revenue graph data by time period' })
  @ApiQuery({ name: 'timePeriod', enum: TimePeriod, required: false, description: 'Filter revenue data by time period' })
  @ApiResponse({ status: 200, description: 'Revenue graph data retrieved successfully', type: RevenueGraphResponseDto })
  getRevenueGraphData(@Query() filter: DashboardFilterDto): Promise<RevenueGraphResponseDto> {
    return this.dashboardService.getRevenueGraphData(filter);
  }

  @Get('reports-graph')
  @ApiOperation({ summary: 'Get reports count data by time period' })
  @ApiQuery({ name: 'timePeriod', enum: TimePeriod, required: false, description: 'Filter reports data by time period' })
  @ApiResponse({ status: 200, description: 'Reports graph data retrieved successfully', type: ReportsGraphResponseDto })
  getReportsGraphData(@Query() filter: DashboardFilterDto): Promise<ReportsGraphResponseDto> {
    return this.dashboardService.getReportsGraphData(filter);
  }
}
