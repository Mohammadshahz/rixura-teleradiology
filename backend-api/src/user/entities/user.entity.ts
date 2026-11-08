import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { UserRole } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { XRayType } from '../../report/enums/x-ray-type.enum';

@Entity('users')
export class User extends BaseEntity {
  @ApiProperty({ description: 'User\'s full name' })
  @Column()
  name: string;

  @ApiProperty({ description: 'User\'s role', enum: UserRole })
  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @ApiProperty({ description: 'User\'s email address' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'Username for login' })
  @Column({ unique: true })
  username: string;

  @ApiProperty({ description: 'User\'s mobile number' })
  @Column({ name: 'mobile_number', nullable: true })
  mobileNumber: string;

  @ApiProperty({ description: 'User\'s address' })
  @Column({ nullable: true })
  address: string;

  @ApiProperty({ description: 'URL to user\'s signature image' })
  @Column({ name: 'signature_url', nullable: true })
  signatureUrl: string;

  @ApiProperty({ description: 'AWS Cognito user ID' })
  @Column({ name: 'cognito_id' })
  cognitoId: string;

  @ApiProperty({ 
    description: 'User status', 
    enum: UserStatus,
    default: UserStatus.ACTIVE
  })
  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE, nullable: true 
  })
  status: UserStatus;

  @ApiProperty({
    description: 'Prices for different X-ray types',
    example: {
      [XRayType.CT_SCAN]: 50,
      [XRayType.XRAY]: 20,
      [XRayType.MRI]: 100
    },
    nullable: true
  })
  @Column({
    type: 'json',
    nullable: true
  })
  prices: Record<XRayType, { regular: number; review: number }>;
}
