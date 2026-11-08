import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { FilterPatientDto } from './dto/filter-patient.dto';
import { PaginatedPatientDto } from './dto/paginated-patient.dto';
import { PaginationMetaDto } from '../common/dto/pagination-meta.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    // Find the latest patient number for this center
    const latestPatient = await this.patientRepository.findOne({
      where: { centerId: createPatientDto.centerId },
      order: { centerPatientNumber: 'DESC' }
    });
    
    // Create the new patient with incremented number
    const patient = this.patientRepository.create({
      ...createPatientDto,
      centerPatientNumber: latestPatient ? latestPatient.centerPatientNumber + 1 : 1
    });
    
    return await this.patientRepository.save(patient);
  }

  async findAll(): Promise<Patient[]> {
    return await this.patientRepository.find({
      relations: ['center'],
    });
  }

  async findOne(id: string): Promise<Patient> {
    const patient = await this.patientRepository.findOne({
      where: { id },
      relations: ['center'],
    });
    
    if (!patient) {
      throw new NotFoundException(`Patient with ID '${id}' not found`);
    }
    
    return patient;
  }

  async findByCenter(centerId: string, filterDto: FilterPatientDto = {}): Promise<PaginatedPatientDto> {
    const query = this.patientRepository.createQueryBuilder('patient')
      .where('patient.centerId = :centerId', { centerId })
      .leftJoinAndSelect('patient.center', 'center');

    // Apply name filter if provided
    if (filterDto.name) {
      query.andWhere('LOWER(patient.name) LIKE LOWER(:name)', { name: `%${filterDto.name}%` });
    }

    // Apply patientId filter if provided
    if (filterDto.patientId) {
      query.andWhere('patient.id LIKE :patientId', { patientId: `%${filterDto.patientId}%` });
    }

    // Apply centerPatientNumber filter if provided
    if (filterDto.centerPatientNumber) {
      query.andWhere('patient.centerPatientNumber = :centerPatientNumber', { centerPatientNumber: filterDto.centerPatientNumber });
    }

    // Apply age range filters if provided
    if (filterDto.minAge !== undefined) {
      query.andWhere('patient.age >= :minAge', { minAge: filterDto.minAge });
    }

    if (filterDto.maxAge !== undefined) {
      query.andWhere('patient.age <= :maxAge', { maxAge: filterDto.maxAge });
    }

    // Apply gender filter if provided
    if (filterDto.gender) {
      query.andWhere('patient.gender = :gender', { gender: filterDto.gender });
    }

    // Get total count after applying filters but before pagination
    const total = await query.getCount();
    
    // Set default values for pagination parameters if not provided
    const page = filterDto.page || 1;
    const limit = filterDto.limit || 10;
    const skip = (page - 1) * limit;
    
    // Apply pagination
    query
      .skip(skip)
      .take(limit)
      .orderBy('patient.createdAt', 'DESC'); // Sort by createdAt in descending order

    // Execute query
    const patients = await query.getMany();
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    
    // Create pagination metadata
    const meta = new PaginationMetaDto();
    meta.total = total;
    meta.page = page;
    meta.limit = limit;
    meta.totalPages = totalPages;
    meta.hasPreviousPage = page > 1;
    meta.hasNextPage = page < totalPages;
    
    // Return paginated response
    return {
      data: patients,
      meta: meta,
    };
  }

  async update(id: string, updatePatientDto: UpdatePatientDto): Promise<Patient> {
    const patient = await this.findOne(id);
    
    // Update patient fields
    Object.assign(patient, updatePatientDto);
    return await this.patientRepository.save(patient);
  }

  async remove(id: string): Promise<void> {
    const patient = await this.findOne(id);
    await this.patientRepository.remove(patient);
  }
}
