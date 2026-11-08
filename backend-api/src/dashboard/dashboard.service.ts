import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, EntityManager, DataSource } from 'typeorm';
import { Report } from '../report/entities/report.entity';
import { ReportStatus } from '../report/enums/report-status.enum';
import { Invoice } from '../invoice/entities/invoice.entity';
import { User } from '../user/entities/user.entity';
import { Center } from '../center/entities/center.entity';
import { UserRole } from '../user/enums/user-role.enum';
import { DashboardFilterDto, TimePeriod } from './dto/dashboard-filter.dto';
import { CardData, DashboardResponseDto, ReportCounts, TopRadiologistDto } from './dto/dashboard-response.dto';
import { RevenueDataPoint, RevenueGraphResponseDto } from './dto/revenue-graph.dto';
import { ReportsGraphResponseDto } from './dto/reports-graph.dto';
import { DASHBOARD_CACHE_KEY, DASHBOARD_CACHE_TTL } from './dashboard.constants';

// Simple in-memory cache implementation
interface CacheEntry<T> {
  data: T;
  expiry: number;
}

type CacheKey = string;

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);
  private readonly cacheMap = new Map<CacheKey, CacheEntry<DashboardResponseDto>>();
  private readonly cacheTTL = 300000; // 5 minutes in milliseconds
  private readonly revenueGraphCacheMap = new Map<CacheKey, CacheEntry<RevenueGraphResponseDto>>();
  private readonly reportsGraphCacheMap = new Map<CacheKey, CacheEntry<ReportsGraphResponseDto>>();

  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Center)
    private readonly centerRepository: Repository<Center>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Calculate time range based on the selected time period
   * @param timePeriod Selected time period (DAILY, MONTHLY, QUARTERLY, YEARLY)
   * @param isPrevious Whether to get the previous period range
   * @returns Object with start and end dates for the period
   */
  private getTimeRange(timePeriod: TimePeriod, isPrevious = false): { startDate: Date, endDate: Date } {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    switch(timePeriod) {
      case TimePeriod.DAILY:
        if (isPrevious) {
          // Previous day
          endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
          startDate = new Date(endDate);
          startDate.setDate(startDate.getDate() - 1);
        } else {
          // Current day
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
          endDate = new Date(now);
        }
        break;

      case TimePeriod.MONTHLY:
        if (isPrevious) {
          // Previous month
          endDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0);
        } else {
          // Current month
          startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
          endDate = new Date(now);
        }
        break;

      case TimePeriod.QUARTERLY:
        const currentQuarter = Math.floor(now.getMonth() / 3);
        
        if (isPrevious) {
          // Previous quarter
          endDate = new Date(now.getFullYear(), currentQuarter * 3, 1, 0, 0, 0);
          startDate = new Date(now.getFullYear(), (currentQuarter - 1) * 3, 1, 0, 0, 0);

          // Handle year boundary for Q1
          if (currentQuarter === 0) {
            startDate = new Date(now.getFullYear() - 1, 9, 1); // Q4 of previous year
          }
        } else {
          // Current quarter
          startDate = new Date(now.getFullYear(), currentQuarter * 3, 1, 0, 0, 0);
          endDate = new Date(now);
        }
        break;

      case TimePeriod.YEARLY:
        if (isPrevious) {
          // Previous year
          endDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
          startDate = new Date(now.getFullYear() - 1, 0, 1, 0, 0, 0);
        } else {
          // Current year
          startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
          endDate = new Date(now);
        }
        break;

      default:
        // Default to current month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
        endDate = new Date(now);
    }

    return { startDate, endDate };
  }

  /**
   * Generate a cache key based on the time period
   * @param timePeriod Time period for filtering dashboard data
   * @returns Unique cache key
   */
  private generateCacheKey(timePeriod: TimePeriod): CacheKey {
    return `dashboard_${timePeriod}`;
  }

  /**
   * Check if cache entry exists and is valid in a specified cache map
   * @param cacheKey Cache key to check
   * @param cacheMap The cache map to check in
   * @returns Boolean indicating if the cache entry is valid
   */
  private isCacheValid<T>(cacheKey: CacheKey, cacheMap: Map<CacheKey, CacheEntry<T>> = this.cacheMap as any): boolean {
    if (!cacheMap.has(cacheKey)) return false;
    
    const cacheEntry = cacheMap.get(cacheKey);
    const now = Date.now();
    return cacheEntry.expiry > now;
  }

  /**
   * Fetches metrics for a specific time period
   * @param timePeriod The time period to fetch data for
   * @param isPrevious Whether to fetch previous period data
   * @returns Card data and report counts for the specified period
   */
  private async fetchPeriodData(entityManager: EntityManager, timePeriod: TimePeriod, isPrevious = false): Promise<{
    cardData: CardData;
    reportCounts: ReportCounts;
  }> {
    const { startDate, endDate } = this.getTimeRange(timePeriod, isPrevious);

    // 1. Get revenue metrics in a single query
    const revenueMetrics = await entityManager.query(`
      SELECT
        COALESCE(SUM(CASE WHEN "userType" = '${UserRole.CENTER}' THEN amount::numeric ELSE 0 END), 0) as total_revenue,
        COALESCE(SUM(CASE WHEN "userType" = '${UserRole.RADIOLOGIST}' THEN amount::numeric ELSE 0 END), 0) as total_expenditures
      FROM invoices 
      WHERE "createdAt" BETWEEN $1 AND $2
    `, [startDate, endDate]);

    // 2. Get user counts in a single query
    const userCounts = await entityManager.query(`
      SELECT
        COUNT(CASE WHEN role = '${UserRole.RADIOLOGIST}' THEN 1 END) as total_radiologists
      FROM users
      WHERE "createdAt" BETWEEN $1 AND $2
    `, [startDate, endDate]);

    // 3. Get center count
    const centerCount = await entityManager.getRepository(Center).count({
      where: { createdAt: Between(startDate, endDate) }
    });

    // 4. Get report counts by status in a single optimized query
    const reportCounts = await entityManager.query(`
      SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN status = '${ReportStatus.REPORTED}' THEN 1 END) as reported_reports,
        COUNT(CASE WHEN status = '${ReportStatus.IDLE}' THEN 1 END) as idle_reports,
        COUNT(CASE WHEN status = '${ReportStatus.REVERTED}' THEN 1 END) as reverted_reports,
        COUNT(CASE WHEN status = '${ReportStatus.COMPLETED}' THEN 1 END) as completed_reports,
        COUNT(CASE WHEN status = '${ReportStatus.ACCEPTED}' THEN 1 END) as accepted_reports
      FROM reports
      WHERE "createdAt" BETWEEN $1 AND $2
    `, [startDate, endDate]);

    return {
      cardData: {
        total_revenue: parseFloat(revenueMetrics[0]?.total_revenue || '0'),
        total_radiologists: parseInt(userCounts[0]?.total_radiologists || '0'),
        total_centers: centerCount,
        total_expenditures: parseFloat(revenueMetrics[0]?.total_expenditures || '0')
      },
      reportCounts: {
        total: parseInt(reportCounts[0]?.total || '0'),
        reported_reports: parseInt(reportCounts[0]?.reported_reports || '0'),
        idle_reports: parseInt(reportCounts[0]?.idle_reports || '0'),
        reverted_reports: parseInt(reportCounts[0]?.reverted_reports || '0'),
        completed_reports: parseInt(reportCounts[0]?.completed_reports || '0'),
        accepted_reports: parseInt(reportCounts[0]?.accepted_reports || '0')
      }
    };
  }

  /**
   * Get the top 3 radiologists with the most reported reports
   * @param entityManager The entity manager to use for database operations
   * @returns Array of top radiologists with their report counts
   */
  private async getTopReportedRadiologists(entityManager: EntityManager): Promise<TopRadiologistDto[]> {
    // Get radiologists with most reported reports
    const topRadiologists = await entityManager.query(`
      SELECT 
        r."radiologistId" as "userId", 
        u."name", 
        u."email", 
        COUNT(r.id) as "reportCount"
      FROM reports r
      JOIN users u ON r."radiologistId" = u.id
      WHERE r.status = $1
      GROUP BY r."radiologistId", u."name", u."email"
      ORDER BY "reportCount" DESC
      LIMIT 3
    `, [ReportStatus.REPORTED]);
    
    return topRadiologists.map(row => ({
      userId: row.userId,
      name: row.name,
      email: row.email,
      reportCount: parseInt(row.reportCount)
    }));
  }

  /**
   * Get dashboard data based on the time period filter with performance optimizations
   * @param filter Filter parameters for dashboard data
   * @returns Dashboard data with all required metrics for current and previous periods
   */
  async getDashboardData(filter: DashboardFilterDto): Promise<DashboardResponseDto> {
    const startTime = Date.now();
    const cacheKey = this.generateCacheKey(filter.timePeriod);

    // Check cache first
    if (this.isCacheValid(cacheKey, this.cacheMap)) {
      this.logger.log(`Cache hit for ${cacheKey}, returning cached data`); 
      const cachedData = this.cacheMap.get(cacheKey).data;
      return cachedData;
    }

    this.logger.log(`Cache miss for ${cacheKey}, fetching fresh data`);

    try {
      // Use a transaction for better performance and consistency
      const dashboardData = await this.dataSource.transaction(async (entityManager) => {
        // Fetch current period data
        const currentData = await this.fetchPeriodData(entityManager, filter.timePeriod, false);
        
        // Fetch previous period data
        const previousData = await this.fetchPeriodData(entityManager, filter.timePeriod, true);

        // Fetch top 3 radiologists with most reported reports
        const topRadiologists = await this.getTopReportedRadiologists(entityManager);

        // Structure the response with both current and previous data and top radiologists
        return {
          card_data: {
            current: currentData.cardData,
            previous: previousData.cardData
          },
          total_reports: {
            current: currentData.reportCounts,
            previous: previousData.reportCounts
          },
          most_top_reported_radiologists: topRadiologists
        };
      });

      // Cache the result
      this.cacheMap.set(cacheKey, {
        data: dashboardData,
        expiry: Date.now() + this.cacheTTL
      });

      const executionTime = Date.now() - startTime;
      this.logger.log(`Dashboard data fetched in ${executionTime}ms`);

      return dashboardData;
    } catch (error) {
      this.logger.error(`Error fetching dashboard data: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get revenue data for graph visualization based on time period
   * @param filter Filter parameters including time period
   * @returns Revenue data points grouped by the selected time period
   */
  async getRevenueGraphData(filter: DashboardFilterDto): Promise<RevenueGraphResponseDto> {
    const startTime = Date.now();
    const cacheKey = `revenue_graph_${filter.timePeriod}`;

    // Check cache first
    if (this.isCacheValid(cacheKey, this.revenueGraphCacheMap)) {
      this.logger.log(`Cache hit for ${cacheKey}, returning cached data`); 
      const cachedData = this.revenueGraphCacheMap.get(cacheKey).data;
      return cachedData;
    }

    this.logger.log(`Cache miss for ${cacheKey}, fetching fresh revenue graph data`);

    try {
      // Set appropriate date ranges based on time period for better data visualization
      let startDate: Date;
      let endDate: Date;
      const now = new Date();
      
      // Use wider date ranges for better data coverage
      switch (filter.timePeriod) {
        case TimePeriod.DAILY:
          // Use full week for daily view
          startDate = new Date(now);
          startDate.setDate(now.getDate() - now.getDay()); // Start from Sunday
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 6); // End on Saturday
          endDate.setHours(23, 59, 59, 999);
          break;
          
        case TimePeriod.MONTHLY:
          // Use full year for monthly view
          startDate = new Date(now.getFullYear(), 0, 1); // January 1st
          endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999); // December 31st
          break;
          
        case TimePeriod.QUARTERLY:
          // Use full year for quarterly view
          startDate = new Date(now.getFullYear(), 0, 1); // January 1st
          endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999); // December 31st
          break;
          
        case TimePeriod.YEARLY:
          // Use 5-year range centered on current year
          startDate = new Date(now.getFullYear() - 2, 0, 1); // Jan 1st, 2 years ago
          endDate = new Date(now.getFullYear() + 2, 11, 31, 23, 59, 59, 999); // Dec 31st, 2 years ahead
          break;
          
        default:
          // Fallback to standard date range
          const dateRange = this.getTimeRange(filter.timePeriod, false);
          startDate = dateRange.startDate;
          endDate = dateRange.endDate;
      }
      
      this.logger.log(`Using date range for revenue graph (${filter.timePeriod}): ${startDate.toISOString()} to ${endDate.toISOString()}`);
      
      let revenueData: RevenueDataPoint[] = [];

      // Different SQL queries and grouping based on the time period
      switch (filter.timePeriod) {
        case TimePeriod.DAILY:
          // Group by day of week (1=Monday to 7=Sunday)
          revenueData = await this.dataSource.query(`
            SELECT
              CASE 
                WHEN EXTRACT(DOW FROM "createdAt") = 0 THEN 'SUN'
                WHEN EXTRACT(DOW FROM "createdAt") = 1 THEN 'MON'
                WHEN EXTRACT(DOW FROM "createdAt") = 2 THEN 'TUE'
                WHEN EXTRACT(DOW FROM "createdAt") = 3 THEN 'WED'
                WHEN EXTRACT(DOW FROM "createdAt") = 4 THEN 'THU'
                WHEN EXTRACT(DOW FROM "createdAt") = 5 THEN 'FRI'
                WHEN EXTRACT(DOW FROM "createdAt") = 6 THEN 'SAT'
              END as key,
              COALESCE(SUM(amount::numeric), 0) as value
            FROM invoices
            WHERE "userType" = $1 AND "createdAt" BETWEEN $2 AND $3
            GROUP BY EXTRACT(DOW FROM "createdAt")
            ORDER BY EXTRACT(DOW FROM "createdAt")
          `, [UserRole.CENTER, startDate, endDate]);

          // Ensure all days of the week are present
          const dayOrder = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
          revenueData = this.ensureAllPeriods(revenueData, dayOrder);
          break;

        case TimePeriod.MONTHLY:
          // Group by month
          revenueData = await this.dataSource.query(`
            SELECT
              CASE 
                WHEN EXTRACT(MONTH FROM "createdAt") = 1 THEN 'JAN'
                WHEN EXTRACT(MONTH FROM "createdAt") = 2 THEN 'FEB'
                WHEN EXTRACT(MONTH FROM "createdAt") = 3 THEN 'MAR'
                WHEN EXTRACT(MONTH FROM "createdAt") = 4 THEN 'APR'
                WHEN EXTRACT(MONTH FROM "createdAt") = 5 THEN 'MAY'
                WHEN EXTRACT(MONTH FROM "createdAt") = 6 THEN 'JUN'
                WHEN EXTRACT(MONTH FROM "createdAt") = 7 THEN 'JUL'
                WHEN EXTRACT(MONTH FROM "createdAt") = 8 THEN 'AUG'
                WHEN EXTRACT(MONTH FROM "createdAt") = 9 THEN 'SEP'
                WHEN EXTRACT(MONTH FROM "createdAt") = 10 THEN 'OCT'
                WHEN EXTRACT(MONTH FROM "createdAt") = 11 THEN 'NOV'
                WHEN EXTRACT(MONTH FROM "createdAt") = 12 THEN 'DEC'
              END as key,
              COALESCE(SUM(amount::numeric), 0) as value
            FROM invoices
            WHERE "userType" = $1 AND "createdAt" BETWEEN $2 AND $3
            GROUP BY EXTRACT(MONTH FROM "createdAt")
            ORDER BY EXTRACT(MONTH FROM "createdAt")
          `, [UserRole.CENTER, startDate, endDate]);

          // Ensure all months are present
          const monthOrder = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
          revenueData = this.ensureAllPeriods(revenueData, monthOrder);
          break;

        case TimePeriod.QUARTERLY:
          // Group by quarter
          revenueData = await this.dataSource.query(`
            SELECT
              CONCAT('Q', EXTRACT(QUARTER FROM "createdAt")) as key,
              COALESCE(SUM(amount::numeric), 0) as value
            FROM invoices
            WHERE "userType" = $1 AND "createdAt" BETWEEN $2 AND $3
            GROUP BY EXTRACT(QUARTER FROM "createdAt")
            ORDER BY EXTRACT(QUARTER FROM "createdAt")
          `, [UserRole.CENTER, startDate, endDate]);

          // Ensure all quarters are present
          const quarterOrder = ['Q1', 'Q2', 'Q3', 'Q4'];
          revenueData = this.ensureAllPeriods(revenueData, quarterOrder);
          break;

        case TimePeriod.YEARLY:
          // Group by year
          revenueData = await this.dataSource.query(`
            SELECT
              EXTRACT(YEAR FROM "createdAt")::text as key,
              COALESCE(SUM(amount::numeric), 0) as value
            FROM invoices
            WHERE "userType" = $1 AND "createdAt" BETWEEN $2 AND $3
            GROUP BY EXTRACT(YEAR FROM "createdAt")
            ORDER BY EXTRACT(YEAR FROM "createdAt")
          `, [UserRole.CENTER, startDate, endDate]);
          
          // Add previous 2 years and next 2 years if not present
          const currentYear = new Date().getFullYear();
          const yearOrder = [
            (currentYear - 2).toString(),
            (currentYear - 1).toString(),
            currentYear.toString(),
            (currentYear + 1).toString(),
            (currentYear + 2).toString(),
          ];
          revenueData = this.ensureAllPeriods(revenueData, yearOrder);
          break;
      }

      // Keep the data as an array of key-value pairs
      const result: RevenueGraphResponseDto = { 
        data: revenueData.map(item => ({
          key: item.key,
          value: parseFloat(item.value as any)
        }))
      };

      // Cache the result
      this.revenueGraphCacheMap.set(cacheKey, {
        data: result,
        expiry: Date.now() + this.cacheTTL
      });

      const executionTime = Date.now() - startTime;
      this.logger.log(`Revenue graph data fetched in ${executionTime}ms`);

      return result;
    } catch (error) {
      this.logger.error(`Error fetching revenue graph data: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Ensures all expected periods are present in the data, adding zeros for missing ones
   * @param data The data points returned from the database
   * @param allPeriods All expected period keys in correct order
   * @returns Complete data with all periods as an array
   */
  private ensureAllPeriods(data: RevenueDataPoint[], allPeriods: string[]): RevenueDataPoint[] {
    const result: RevenueDataPoint[] = [];
    const dataMap = new Map<string, number>();
    
    // Create a map from the actual data
    data.forEach(item => {
      dataMap.set(item.key, parseFloat(item.value as any));
    });
    
    // Create an entry for each period (preserving the order from allPeriods)
    allPeriods.forEach(period => {
      result.push({
        key: period,
        value: dataMap.get(period) || 0
      });
    });
    
    return result;
  }

  /**
   * Get reports count data for graph visualization based on time period
   * @param filter Filter parameters including time period
   * @returns Reports count data points grouped by the selected time period
   */
  async getReportsGraphData(filter: DashboardFilterDto): Promise<ReportsGraphResponseDto> {
    const startTime = Date.now();
    const cacheKey = `reports_graph_${filter.timePeriod}`;

    // Check cache first
    if (this.isCacheValid(cacheKey, this.reportsGraphCacheMap)) {
      this.logger.log(`Cache hit for ${cacheKey}, returning cached data`); 
      const cachedData = this.reportsGraphCacheMap.get(cacheKey).data;
      return cachedData;
    }

    this.logger.log(`Cache miss for ${cacheKey}, fetching fresh reports graph data`);

    try {
      // Set appropriate date ranges based on time period for better data visualization
      let startDate: Date;
      let endDate: Date;
      const now = new Date();
      
      // Use wider date ranges for better data coverage
      switch (filter.timePeriod) {
        case TimePeriod.DAILY:
          // Use full week for daily view
          startDate = new Date(now);
          startDate.setDate(now.getDate() - now.getDay()); // Start from Sunday
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 6); // End on Saturday
          endDate.setHours(23, 59, 59, 999);
          break;
          
        case TimePeriod.MONTHLY:
          // Use full year for monthly view
          startDate = new Date(now.getFullYear(), 0, 1); // January 1st
          endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999); // December 31st
          break;
          
        case TimePeriod.QUARTERLY:
          // Use full year for quarterly view
          startDate = new Date(now.getFullYear(), 0, 1); // January 1st
          endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999); // December 31st
          break;
          
        case TimePeriod.YEARLY:
          // Use 5-year range centered on current year
          startDate = new Date(now.getFullYear() - 2, 0, 1); // Jan 1st, 2 years ago
          endDate = new Date(now.getFullYear() + 2, 11, 31, 23, 59, 59, 999); // Dec 31st, 2 years ahead
          break;
          
        default:
          // Fallback to standard date range
          const dateRange = this.getTimeRange(filter.timePeriod, false);
          startDate = dateRange.startDate;
          endDate = dateRange.endDate;
      }
      
      this.logger.log(`Using date range for reports graph (${filter.timePeriod}): ${startDate.toISOString()} to ${endDate.toISOString()}`);
      
      let reportsData: RevenueDataPoint[] = [];

      // Different SQL queries and grouping based on the time period
      switch (filter.timePeriod) {
        case TimePeriod.DAILY:
          // Group by day of week
          reportsData = await this.dataSource.query(`
            SELECT
              CASE 
                WHEN EXTRACT(DOW FROM "createdAt") = 0 THEN 'SUN'
                WHEN EXTRACT(DOW FROM "createdAt") = 1 THEN 'MON'
                WHEN EXTRACT(DOW FROM "createdAt") = 2 THEN 'TUE'
                WHEN EXTRACT(DOW FROM "createdAt") = 3 THEN 'WED'
                WHEN EXTRACT(DOW FROM "createdAt") = 4 THEN 'THU'
                WHEN EXTRACT(DOW FROM "createdAt") = 5 THEN 'FRI'
                WHEN EXTRACT(DOW FROM "createdAt") = 6 THEN 'SAT'
              END as key,
              COUNT(*) as value
            FROM reports
            WHERE "createdAt" BETWEEN $1 AND $2
            GROUP BY EXTRACT(DOW FROM "createdAt")
            ORDER BY EXTRACT(DOW FROM "createdAt")
          `, [startDate, endDate]);

          // Ensure all days of the week are present
          const dayOrder = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
          reportsData = this.ensureAllPeriods(reportsData, dayOrder);
          break;

        case TimePeriod.MONTHLY:
          // Group by month
          reportsData = await this.dataSource.query(`
            SELECT
              CASE 
                WHEN EXTRACT(MONTH FROM "createdAt") = 1 THEN 'JAN'
                WHEN EXTRACT(MONTH FROM "createdAt") = 2 THEN 'FEB'
                WHEN EXTRACT(MONTH FROM "createdAt") = 3 THEN 'MAR'
                WHEN EXTRACT(MONTH FROM "createdAt") = 4 THEN 'APR'
                WHEN EXTRACT(MONTH FROM "createdAt") = 5 THEN 'MAY'
                WHEN EXTRACT(MONTH FROM "createdAt") = 6 THEN 'JUN'
                WHEN EXTRACT(MONTH FROM "createdAt") = 7 THEN 'JUL'
                WHEN EXTRACT(MONTH FROM "createdAt") = 8 THEN 'AUG'
                WHEN EXTRACT(MONTH FROM "createdAt") = 9 THEN 'SEP'
                WHEN EXTRACT(MONTH FROM "createdAt") = 10 THEN 'OCT'
                WHEN EXTRACT(MONTH FROM "createdAt") = 11 THEN 'NOV'
                WHEN EXTRACT(MONTH FROM "createdAt") = 12 THEN 'DEC'
              END as key,
              COUNT(*) as value
            FROM reports
            WHERE "createdAt" BETWEEN $1 AND $2
            GROUP BY EXTRACT(MONTH FROM "createdAt")
            ORDER BY EXTRACT(MONTH FROM "createdAt")
          `, [startDate, endDate]);

          // Ensure all months are present
          const monthOrder = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
          reportsData = this.ensureAllPeriods(reportsData, monthOrder);
          break;

        case TimePeriod.QUARTERLY:
          // Group by quarter
          reportsData = await this.dataSource.query(`
            SELECT
              CONCAT('Q', EXTRACT(QUARTER FROM "createdAt")) as key,
              COUNT(*) as value
            FROM reports
            WHERE "createdAt" BETWEEN $1 AND $2
            GROUP BY EXTRACT(QUARTER FROM "createdAt")
            ORDER BY EXTRACT(QUARTER FROM "createdAt")
          `, [startDate, endDate]);

          // Ensure all quarters are present
          const quarterOrder = ['Q1', 'Q2', 'Q3', 'Q4'];
          reportsData = this.ensureAllPeriods(reportsData, quarterOrder);
          break;

        case TimePeriod.YEARLY:
          // Group by year
          reportsData = await this.dataSource.query(`
            SELECT
              EXTRACT(YEAR FROM "createdAt")::text as key,
              COUNT(*) as value
            FROM reports
            WHERE "createdAt" BETWEEN $1 AND $2
            GROUP BY EXTRACT(YEAR FROM "createdAt")
            ORDER BY EXTRACT(YEAR FROM "createdAt")
          `, [startDate, endDate]);
          
          // Add previous 2 years and next 2 years if not present
          const currentYear = new Date().getFullYear();
          const yearOrder = [
            (currentYear - 2).toString(),
            (currentYear - 1).toString(),
            currentYear.toString(),
            (currentYear + 1).toString(),
            (currentYear + 2).toString(),
          ];
          reportsData = this.ensureAllPeriods(reportsData, yearOrder);
          break;
      }

      // Keep the data as an array of key-value pairs
      const result: ReportsGraphResponseDto = {
        data: reportsData.map(item => ({
          key: item.key,
          value: parseInt(item.value as any)
        }))
      };

      // Cache the result
      this.reportsGraphCacheMap.set(cacheKey, {
        data: result,
        expiry: Date.now() + this.cacheTTL
      });

      const executionTime = Date.now() - startTime;
      this.logger.log(`Reports graph data fetched in ${executionTime}ms`);

      return result;
    } catch (error) {
      this.logger.error(`Error fetching reports graph data: ${error.message}`, error.stack);
      throw error;
    }
  }
}
