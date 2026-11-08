import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Report } from './report.entity';
import { User } from '../../user/entities/user.entity';
import { UserRole } from '../../user/enums/users.enum';
import { Center } from '../../center/entities/center.entity';

@Entity('report_comments')
export class ReportComment extends BaseEntity {
  @ApiProperty({
    description: 'ID of the report this comment belongs to',
    example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
  })
  @Column()
  reportId: string;

  @ManyToOne(() => Report, report => report.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reportId' })
  report: Report;

  // userId removed as requested - using centerId and radiologistId directly
  
  @ApiProperty({
    description: 'Type of user who created the comment (RADIOLOGIST or CENTER)',
    enum: [UserRole.RADIOLOGIST, UserRole.CENTER],
    example: 'RADIOLOGIST'
  })
  @Column({
    type: 'varchar',
    comment: 'Type of user who created this comment (RADIOLOGIST or CENTER)'
  })
  userType: string;

  @ApiProperty({
    description: 'Center ID if the comment is from/to a center',
    example: 'c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8',
    required: false
  })
  @Column({ nullable: true })
  centerId: string;

  @ManyToOne(() => Center, { nullable: true })
  @JoinColumn({ name: 'centerId' })
  center: Center;

  @ApiProperty({
    description: 'Radiologist ID if the comment is from/to a radiologist',
    example: 'r3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8',
    required: false
  })
  @Column({ nullable: true })
  radiologistId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'radiologistId' })
  radiologist: User;
  
  @ApiProperty({
    description: 'Content of the comment',
    example: 'Please review the abnormality in the lower right section of the X-ray.',
  })
  @Column('text')
  content: string;

  @ApiProperty({
    description: 'Whether the comment has been read by the recipient',
    example: false,
    default: false
  })
  @Column({ default: false })
  isRead: boolean;
  
  @ApiProperty({
    description: 'Timestamp when the comment was read',
    required: false,
    example: '2025-06-10T16:30:45Z'
  })
  @Column({ type: 'timestamp', nullable: true })
  readAt: Date;
}