import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTemplateDto } from './dto/create-template.dto';
import { FilterTemplateDto } from './dto/filter-template.dto';
import { PaginatedTemplateDto } from './dto/paginated-template.dto';
import { TemplateResponseDto } from './dto/template-response.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { Template } from './entities/template.entity';
import { TemplateType } from './enums/template-type.enum';
import { User } from '../user/entities/user.entity';
import { UserRole } from '../user/enums/user-role.enum';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(Template)
    private readonly templateRepository: Repository<Template>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createTemplateDto: CreateTemplateDto): Promise<TemplateResponseDto> {
    // Enforce radiologistId rules based on template type
    if (createTemplateDto.type === TemplateType.DEFAULT) {
      // For DEFAULT templates, radiologistId should not be present
      // Check if radiologistId exists as a property
      if ('radiologistId' in createTemplateDto) {
        delete createTemplateDto.radiologistId; // Remove the property completely
      }
    } else if (createTemplateDto.type === TemplateType.CUSTOM) {
      // For CUSTOM templates, radiologistId is mandatory
      if (!createTemplateDto.radiologistId) {
        throw new BadRequestException('CUSTOM templates must include a radiologistId');
      }
      
      // Validate that radiologistId exists and has RADIOLOGIST role
      const radiologist = await this.userRepository.findOne({
        where: { 
          id: createTemplateDto.radiologistId,
          role: UserRole.RADIOLOGIST
        }
      });
      
      if (!radiologist) {
        throw new BadRequestException(`User with ID ${createTemplateDto.radiologistId} does not exist or is not a radiologist`);
      }
    }
    
    const template = this.templateRepository.create(createTemplateDto);
    const savedTemplate = await this.templateRepository.save(template);
    return new TemplateResponseDto(savedTemplate);
  }

  async findAll(filterDto?: FilterTemplateDto): Promise<TemplateResponseDto[] | PaginatedTemplateDto> {
    const query = this.templateRepository.createQueryBuilder('template');
    
    // Apply filters if provided
    if (filterDto) {
      if (filterDto.title) {
        query.andWhere('LOWER(template.title) LIKE LOWER(:title)', {
          title: `%${filterDto.title}%`,
        });
      }
      
      if (filterDto.type) {
        query.andWhere('template.type = :type', {
          type: filterDto.type,
        });
      }
      
      if (filterDto.radiologistId) {
        query.andWhere('template.radiologist_id = :radiologistId', {
          radiologistId: filterDto.radiologistId,
        });
      }
      
      // If pagination parameters are provided, return paginated response
      if (filterDto.page !== undefined || filterDto.limit !== undefined) {
        const page = filterDto.page || 1;
        const limit = filterDto.limit || 10;
        const skip = (page - 1) * limit;
        
        // Get total count for pagination metadata
        const total = await query.getCount();
        
        // Get paginated results
        const templates = await query
          .orderBy('template.createdAt', 'DESC') // Sort by createdAt in descending order
          .skip(skip)
          .take(limit)
          .getMany();
        
        // Calculate total pages
        const totalPages = Math.ceil(total / limit);
        
        // Map to response DTOs
        const data = templates.map(template => new TemplateResponseDto(template));
        
        // Return paginated response
        return {
          data,
          total,
          page,
          limit,
          totalPages
        };
      }
    }
    
    // If no pagination requested, return all results
    const templates = await query.orderBy('template.title', 'ASC').getMany();
    return templates.map(template => new TemplateResponseDto(template));
  }

  async findAllByRadiologist(radiologistId: string): Promise<TemplateResponseDto[]> {
    // Get both radiologist-specific templates and default templates
    const templates = await this.templateRepository.find({
      where: [
        { radiologistId, type: TemplateType.CUSTOM }, // Templates specific to this radiologist
        { radiologistId: null, type: TemplateType.DEFAULT } // Default templates with null radiologistId
      ],
      order: { title: 'ASC' }
    });
    return templates.map(template => new TemplateResponseDto(template));
  }

  async findOne(id: string): Promise<TemplateResponseDto> {
    const template = await this.templateRepository.findOne({ where: { id } });
    if (!template) {
      throw new NotFoundException(`Template with id ${id} not found`);
    }
    return new TemplateResponseDto(template);
  }

  async update(id: string, updateTemplateDto: UpdateTemplateDto): Promise<TemplateResponseDto> {
    const template = await this.templateRepository.findOne({ where: { id } });
    if (!template) {
      throw new NotFoundException(`Template with id ${id} not found`);
    }

    await this.templateRepository.update(id, updateTemplateDto);
    const updatedTemplate = await this.templateRepository.findOne({ where: { id } });
    return new TemplateResponseDto(updatedTemplate);
  }

  async remove(id: string): Promise<void> {
    const result = await this.templateRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Template with id ${id} not found`);
    }
  }
}
