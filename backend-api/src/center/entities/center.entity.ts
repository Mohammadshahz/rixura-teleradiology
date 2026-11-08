import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('centers')
export class Center extends BaseEntity {
  @ApiProperty({
    description: 'Name of the center',
    example: 'City Medical Center',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Unique code for the center',
    example: 'CMC001',
  })
  @Column({ unique: true })
  code: string;

  @ApiProperty({
    description: 'Physical address of the center',
    example: '123 Medical Plaza, City, State, ZIP',
    required: false
  })
  @Column({ nullable: true })
  address: string;

  @ApiProperty({
    description: 'S3 path to the center logo',
    example: 'centers/user-123/user-123-center-logo',
    required: false
  })
  @Column({ nullable: true })
  logo: string;

  @ApiProperty({
    description: 'Website URL of the center',
    example: 'https://www.medicalcenter.com',
    required: false
  })
  @Column({ nullable: true })
  website: string;

  @ApiProperty({
    description: 'Phone number of the center',
    example: '+911234567890',
    required: false
  })
  @Column({ nullable: true })
  phoneNumbers: string;

  @ApiProperty({
    description: 'Scopes or specialties of the center',
    example: ['Radiology', 'Cardiology', 'Neurology'],
    required: false,
    isArray: true,
    type: [String]
  })
  @Column('simple-array', { nullable: true })
  centerScopes: string[];
}
