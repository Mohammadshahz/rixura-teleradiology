import { EntityRepository, Repository } from 'typeorm';
import { Report } from './entities/report.entity';

@EntityRepository(Report)
export class ReportRepository extends Repository<Report> {
  async findByFilters(filters: Partial<Report>): Promise<Report[]> {
    const query = this.createQueryBuilder('report');
    
    if (filters.centerId) {
      query.andWhere('report.centerId = :centerId', { centerId: filters.centerId });
    }
    
    if (filters.patientId) {
      query.andWhere('report.patientId = :patientId', { patientId: filters.patientId });
    }
    
    if (filters.radiologistId) {
      query.andWhere('report.radiologistId = :radiologistId', { radiologistId: filters.radiologistId });
    }
    
    if (filters.xRayType) {
      query.andWhere('report.xRayType = :xRayType', { xRayType: filters.xRayType });
    }
    
    if (filters.reportType) {
      query.andWhere('report.reportType = :reportType', { reportType: filters.reportType });
    }
    
    return query
      .leftJoinAndSelect('report.center', 'center')
      .leftJoinAndSelect('report.patient', 'patient')
      .leftJoinAndSelect('report.radiologist', 'radiologist')
      .getMany();
  }
}
