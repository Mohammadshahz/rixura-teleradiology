import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { FilterPatientDto } from './dto/filter-patient.dto';
import { PaginatedPatientDto } from './dto/paginated-patient.dto';
import { Patient } from './entities/patient.entity';

@ApiTags('Patients')
@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new patient' })
  @ApiResponse({ status: 201, description: 'The patient has been successfully created.', type: Patient })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createPatientDto: CreatePatientDto): Promise<Patient> {
    return await this.patientService.create(createPatientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all patients' })
  @ApiResponse({ status: 200, description: 'Return all patients.', type: [Patient] })
  async findAll(): Promise<Patient[]> {
    return await this.patientService.findAll();
  }

  @Get('center/:centerId')
  @ApiOperation({ summary: 'Get patients by center ID with pagination' })
  @ApiResponse({ status: 200, description: 'Return paginated patients from a specific center.', type: PaginatedPatientDto })
  async findByCenter(
    @Param('centerId') centerId: string,
    @Query() filterDto: FilterPatientDto
  ): Promise<PaginatedPatientDto> {
    return await this.patientService.findByCenter(centerId, filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a patient by id' })
  @ApiResponse({ status: 200, description: 'Return the patient.', type: Patient })
  @ApiResponse({ status: 404, description: 'Patient not found.' })
  async findOne(@Param('id') id: string): Promise<Patient> {
    return await this.patientService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a patient' })
  @ApiResponse({ status: 200, description: 'The patient has been successfully updated.', type: Patient })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Patient not found.' })
  async update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto): Promise<Patient> {
    return await this.patientService.update(id, updatePatientDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a patient' })
  @ApiResponse({ status: 200, description: 'The patient has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Patient not found.' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.patientService.remove(id);
  }
}
