import { Column, Entity, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Center } from '../../center/entities/center.entity';
import { Patient } from '../../patient/entities/patient.entity';
import { XRayType } from '../enums/x-ray-type.enum';
import { ReportType } from '../enums/report-type.enum';
import { ReportStatus } from '../enums/report-status.enum';
import { User } from '../../user/entities/user.entity';
import { ReportComment } from './report-comment.entity';
import { Template } from '../../template/entities/template.entity';

@Entity('reports')
export class Report extends BaseEntity {
  @ApiProperty({
    description: 'Center ID that the report belongs to',
    example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
  })
  @Column()
  centerId: string;

  @ManyToOne(() => Center)
  @JoinColumn({ name: 'centerId' })
  center: Center;

  @ApiProperty({
    description: 'Title of the report',
    example: 'Chest X-Ray Report',
  })
  @Column()
  title: string;

  @ApiProperty({
    description: 'Patient ID that the report belongs to',
    example: 'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7',
  })
  @Column()
  patientId: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @ApiProperty({
    description: 'Type of X-Ray',
    enum: XRayType,
    example: XRayType.XRAY,
  })
  @Column({
    type: 'enum',
    enum: XRayType,
  })
  xRayType: XRayType;

  @ApiProperty({
    description: 'Complaint or description of the issue',
    example: 'Patient experiencing chest pain and difficulty breathing',
  })
  @Column('text')
  complaint: string;

  @ApiProperty({
    description: 'Type of report',
    enum: ReportType,
    example: ReportType.NORMAL,
  })
  @Column({
    type: 'enum',
    enum: ReportType,
  })
  reportType: ReportType;

  @ApiProperty({
    description: 'URLs to the report files in S3',
    example: ['reports/123/file1.dcm', 'reports/123/file2.jpg'],
    isArray: true
  })
  @Column('simple-array', { nullable: true })
  reportUrls: string[];

  @ApiProperty({
    description: 'Radiologist ID who created the report',
    example: 'c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8',
  })
  @Column({ nullable: true })
  radiologistId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'radiologistId' })
  radiologist: User;

  @OneToMany(() => ReportComment, comment => comment.report)
  comments: ReportComment[];

  @ApiProperty({
    description: 'Status of the report',
    enum: ReportStatus,
    example: ReportStatus.IDLE,
    default: ReportStatus.IDLE,
  })
  @Column({
    type: 'enum',
    enum: ReportStatus,
    default: ReportStatus.IDLE,
  })
  status: ReportStatus;

  @ApiProperty({
    description: 'Timestamp when the report was marked as reported',
    nullable: true,
  })
  @Column({ nullable: true })
  reportedAt: Date;

  @ApiProperty({
    description: 'AI-generated content for the report',
    nullable: true,
  })
  @Column('text', { nullable: true })
  reportGeneratedContent: string;

  @ApiProperty({
    description: 'Template ID used to generate the report content',
    example: 'd4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9',
    nullable: true,
  })
  @Column({ nullable: true })
  templateId: string;

  @ManyToOne(() => Template)
  @JoinColumn({ name: 'templateId' })
  template: Template;
}
