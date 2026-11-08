import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { Center } from './center.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('user_centers')
export class UserCenter extends BaseEntity {
  @ApiProperty({
    description: 'User associated with the center',
    type: () => User,
  })
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({
    description: 'Center associated with the user',
    type: () => Center,
  })
  @ManyToOne(() => Center, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'center_id' })
  center: Center;
}
