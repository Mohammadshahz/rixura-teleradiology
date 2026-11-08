import { Column, Entity, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Center } from '../../center/entities/center.entity';
import { Gender } from '../../common/enums/gender.enum';

@Entity('patients')
export class Patient extends BaseEntity {
  @ApiProperty({
    description: 'Center ID that the patient belongs to',
    example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
  })
  @Column()
  centerId: string;

  @ManyToOne(() => Center)
  @JoinColumn({ name: 'centerId' })
  center: Center;

  @ApiProperty({
    description: 'Incremental patient number within the center',
    example: 1,
  })
  @Column({ nullable: true })
  @Index()
  centerPatientNumber: number;

  @ApiProperty({
    description: 'Name of the patient',
    example: 'John Doe',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Age of the patient',
    example: 35,
  })
  @Column()
  age: number;

  @ApiProperty({
    description: 'Gender of the patient',
    example: Gender.MALE,
    enum: Gender,
    required: false,
  })
  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender;

  @ApiProperty({
    description: 'Phone number of the patient',
    example: '9876543210',
    required: false,
  })
  @Column({ nullable: true, type: 'varchar' })
  phoneNumber: string;

  @ApiProperty({
    description: 'Email address of the patient',
    example: 'johndoe@example.com',
  })
  @Column({ nullable: true })
  email: string;
}
