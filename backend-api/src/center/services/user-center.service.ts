import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCenter } from '../entities/user-center.entity';
import { User } from '../../user/entities/user.entity';
import { Center } from '../entities/center.entity';
import { UserRole } from '../../user/enums/users.enum';

@Injectable()
export class UserCenterService {
  constructor(
    @InjectRepository(UserCenter)
    private userCenterRepository: Repository<UserCenter>,
    @InjectRepository(Center)
    private centerRepository: Repository<Center>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Create a relationship between a user and a center
   * @param userId The ID of the user
   * @param centerId The ID of the center
   */
  async createUserCenterRelation(userId: string, centerId: string): Promise<UserCenter> {
    // Check if the center exists
    const center = await this.centerRepository.findOne({ where: { id: centerId } });
    if (!center) {
      throw new NotFoundException(`Center with ID '${centerId}' not found`);
    }

    // Check if the relationship already exists
    const existingRelation = await this.userCenterRepository.findOne({
      where: {
        user: { id: userId },
        center: { id: centerId },
      },
      relations: ['user', 'center'],
    });

    if (existingRelation) {
      throw new ConflictException('User-center relationship already exists');
    }

    // Create the relationship
    const userCenter = this.userCenterRepository.create({
      user: { id: userId },
      center: { id: centerId },
    });

    return await this.userCenterRepository.save(userCenter);
  }

  /**
   * Find all centers associated with a user
   * @param userId The ID of the user
   * @throws {NotFoundException} When user not found
   * @throws {ForbiddenException} When user role is not CENTER
   */
  async findCentersByUserId(userId: string): Promise<UserCenter[]> {
    // First find the user to check their role
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID '${userId}' not found`);
    }
    
    // Check if user has CENTER role
    if (user.role !== UserRole.CENTER) {
      throw new ForbiddenException('Only users with CENTER role can access centers');
    }
    
    // If role is valid, return the centers
    return await this.userCenterRepository.find({
      where: { user: { id: userId } },
      relations: ['center'],
    });
  }

  /**
   * Find all users associated with a center
   * @param centerId The ID of the center
   */
  async findUsersByCenterId(centerId: string): Promise<UserCenter[]> {
    return await this.userCenterRepository.find({
      where: { center: { id: centerId } },
      relations: ['user'],
    });
  }

  /**
   * Remove a relationship between a user and a center
   * @param userId The ID of the user
   * @param centerId The ID of the center
   */
  async removeUserCenterRelation(userId: string, centerId: string): Promise<void> {
    const userCenter = await this.userCenterRepository.findOne({
      where: {
        user: { id: userId },
        center: { id: centerId },
      },
    });

    if (!userCenter) {
      throw new NotFoundException('User-center relationship not found');
    }

    await this.userCenterRepository.remove(userCenter);
  }
}
