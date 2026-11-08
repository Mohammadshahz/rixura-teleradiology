import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum ContactType {
  CENTER = 'CENTER',
  RADIOLOGIST = 'RADIOLOGIST',
}

export enum RequestType {
  DEMO = 'DEMO',
  QUERY = 'QUERY',
}

@Entity('contact_us')
export class ContactUs {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier for the contact request' })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ description: 'Full name of the person making contact' })
  fullname: string;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ description: 'Email address of the contact' })
  email: string;

  @Column({ type: 'varchar', length: 50 })
  @ApiProperty({ description: 'Phone number of the contact' })
  phone_number: string;

  @Column({ type: 'enum', enum: ContactType })
  @ApiProperty({ 
    description: 'Type of contact - CENTER or RADIOLOGIST', 
    enum: ContactType,
    enumName: 'ContactType'
  })
  contactType: ContactType;

  @Column({ type: 'enum', enum: RequestType, name: 'request_type' })
  @ApiProperty({ 
    description: 'Type of request - DEMO or QUERY', 
    enum: RequestType,
    enumName: 'RequestType'
  })
  requestType: RequestType;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Contact message content', required: false })
  message?: string;

  @Column({ type: 'boolean', default: false })
  @ApiProperty({ description: 'Flag indicating if this contact request has been read' })
  isRead: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  @ApiProperty({ description: 'When the contact request was created' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @ApiProperty({ description: 'When the contact request was last updated' })
  updatedAt: Date;
}
