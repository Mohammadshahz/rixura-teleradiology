import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './entities/feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { FindFeedbackDto } from './dto/find-feedback.dto';
import { PaginatedFeedbackDto, FeedbackWithUserDto } from './dto/paginated-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
  ) {}

  async create(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    const feedback = this.feedbackRepository.create(createFeedbackDto);
    return this.feedbackRepository.save(feedback);
  }

  async findAll(findFeedbackDto?: FindFeedbackDto): Promise<PaginatedFeedbackDto | Feedback[]> {
    const query = this.feedbackRepository.createQueryBuilder('feedback')
      .leftJoinAndSelect('feedback.user', 'user');
    
    // Apply filters
    if (findFeedbackDto?.userId) {
      query.andWhere('feedback.user_id = :userId', { 
        userId: findFeedbackDto.userId 
      });
    }
    
    if (findFeedbackDto?.name) {
      query.andWhere('LOWER(user.username) LIKE LOWER(:name)', { 
        name: `%${findFeedbackDto.name}%` 
      });
    }
    
    if (findFeedbackDto?.phoneNumber) {
      query.andWhere('user.mobileNumber LIKE :phoneNumber', { 
        phoneNumber: `%${findFeedbackDto.phoneNumber}%` 
      });
    }
    
    // If pagination parameters are provided, return paginated response
    if (findFeedbackDto?.page !== undefined || findFeedbackDto?.limit !== undefined) {
      // Set default values if not provided
      const page = findFeedbackDto.page || 1;
      const limit = findFeedbackDto.limit || 10;
      const skip = (page - 1) * limit;
      
      // Get total count for pagination metadata
      const total = await query.getCount();
      
      // Apply pagination
      const results = await query
        .orderBy('feedback.createdAt', 'DESC')
        .skip(skip)
        .take(limit)
        .getMany();
      
      // Map results to FeedbackWithUserDto for consistent response format
      const data = results.map(feedback => {
        const dto = new FeedbackWithUserDto();
        Object.assign(dto, feedback);
        return dto;
      });
      
      // Calculate total pages
      const totalPages = Math.ceil(total / limit);
      
      // Construct paginated response
      return {
        data,
        total,
        page,
        limit,
        totalPages
      };
    }
    
    // If no pagination parameters, return all results
    return query
      .orderBy('feedback.createdAt', 'DESC')
      .getMany();
  }

  async findOne(id: string): Promise<Feedback> {
    const feedback = await this.feedbackRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }

    return feedback;
  }

  async update(id: string, updateFeedbackDto: UpdateFeedbackDto): Promise<Feedback> {
    const feedback = await this.findOne(id);
    
    if (updateFeedbackDto.description) {
      feedback.description = updateFeedbackDto.description;
    }
    
    if (updateFeedbackDto.userId) {
      feedback.userId = updateFeedbackDto.userId;
    }
    
    return this.feedbackRepository.save(feedback);
  }

  async remove(id: string): Promise<void> {
    const feedback = await this.findOne(id);
    await this.feedbackRepository.remove(feedback);
  }
}
