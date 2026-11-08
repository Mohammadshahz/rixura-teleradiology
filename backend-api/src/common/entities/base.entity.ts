import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Entity, BaseEntity as TypeOrmBaseEntity } from 'typeorm';
import { v4 as uuidv4 } from 'uuid'; // For generating UUID

@Entity()
export class BaseEntity extends TypeOrmBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor() {
    super();
    this.id = uuidv4();
  }
}
