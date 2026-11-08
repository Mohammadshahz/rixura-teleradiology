import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { TemplateType } from '../enums/template-type.enum';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('templates')
export class Template extends BaseEntity {

  @ApiProperty({
    example: 'Brain MRI Template',
    description: 'The title of the template',
  })
  @Column({ type: 'varchar' })
  title: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'The unique identifier of the template (UUID)',
  })

  @ApiProperty({
    example: 'DEFAULT',
    description: 'The type of the template',
    enum: TemplateType,
  })
  @Column({ type: 'enum', enum: TemplateType, default: TemplateType.DEFAULT })
  type: TemplateType;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'The ID of the radiologist who created/owns this template',
  })
  @Column({ name: 'radiologist_id', nullable: true })
  radiologistId: string;

  @ApiProperty({
    example: 'Detailed template for standard brain MRI reporting',
    description: 'Description of the template',
  })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({
    type: () => User,
    description: 'The radiologist associated with this template',
  })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'radiologist_id' })
  radiologist: User;


}
