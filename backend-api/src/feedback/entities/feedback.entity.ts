import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';

@Entity('feedbacks')
export class Feedback extends BaseEntity {
  @ApiProperty({
    description: 'Description of the feedback',
    example: 'The report generation workflow is very intuitive and user-friendly.'
  })
  @Column('text')
  description: string;

  @ApiProperty({
    description: 'ID of the user who provided the feedback',
    example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
  })
  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
