import { Injectable, NotFoundException, ConflictException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Center } from '../entities/center.entity';
import { CreateCenterDto } from '../dto/create-center.dto';
import { UpdateCenterDto } from '../dto/update-center.dto';
import { CreateCenterWithUserDto } from '../dto/create-center-with-user.dto';
import { User } from '../../user/entities/user.entity';
import { UserStatus } from '../../user/enums/user-status.enum';
import { UserService } from '../../user/services/user.service';
import { UserRole } from '../../user/enums/user-role.enum';
import { FilterCenterDto } from '../dto/filter-center.dto';
import { PaginatedCenterDto, CenterWithUsersDto } from '../dto/paginated-center.dto';
import { PaginationMetaDto } from '../../common/dto/pagination-meta.dto';
import { UserCenter } from '../entities/user-center.entity';
import { S3Service } from '../../aws/s3.service';

@Injectable()
export class CenterService {
  constructor(
    @InjectRepository(Center)
    private centerRepository: Repository<Center>,
    @InjectRepository(UserCenter)
    private userCenterRepository: Repository<UserCenter>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userService: UserService,
    private s3Service: S3Service,
  ) {}

  async create(createCenterDto: CreateCenterDto, logoFile?: Express.Multer.File): Promise<Center> {
    // Check if center with same code already exists
    const centerExists = await this.centerRepository.findOne({
      where: { code: createCenterDto.code },
    });

    if (centerExists) {
      throw new ConflictException('Center with this code already exists');
    }

    const center = this.centerRepository.create(createCenterDto);
    
    // Save center first to get the ID
    await this.centerRepository.save(center);
    
    // Upload logo if provided
    if (logoFile) {
      try {
        const fileName = `${center.id}-center-logo`;
        const folderPath = `centers/${center.id}`;
        const logoKey = await this.s3Service.uploadImage(logoFile, folderPath, fileName);
        
        // Update center with logo path
        center.logo = logoKey;
        await this.centerRepository.save(center);
      } catch (error) {
        console.error('Error uploading logo:', error);
        // Continue with center creation even if logo upload fails
      }
    }
    
    return center;
  }

  // The original findAll method is kept for backward compatibility and internal use
  async findAll(): Promise<Center[]> {
    return await this.centerRepository.find();
  }

  /**
   * Find all centers with pagination and include associated users with CENTER role
   * @param filterDto Filtering and pagination options
   * @returns Paginated centers with associated users
   */
  async findAllPaginated(filterDto: FilterCenterDto): Promise<PaginatedCenterDto> {
    const query = this.centerRepository.createQueryBuilder('center');
    
    // Apply filters
    if (filterDto.name) {
      query.andWhere('center.name ILIKE :name', { name: `%${filterDto.name}%` });
    }
    
    if (filterDto.code) {
      query.andWhere('center.code ILIKE :code', { code: `%${filterDto.code}%` });
    }
    
    if (filterDto.address) {
      query.andWhere('center.address ILIKE :address', { address: `%${filterDto.address}%` });
    }
    
    if (filterDto.website) {
      query.andWhere('center.website ILIKE :website', { website: `%${filterDto.website}%` });
    }
    
    if (filterDto.phoneNumbers) {
      query.andWhere('center.phoneNumbers ILIKE :phoneNumbers', { phoneNumbers: `%${filterDto.phoneNumbers}%` });
    }
    
    if (filterDto.centerScopes) {
      query.andWhere('center.centerScopes LIKE :centerScopes', { centerScopes: `%${filterDto.centerScopes}%` });
    }
    
    // Get total count before pagination
    const total = await query.getCount();
    
    // Set default values for pagination parameters if not provided
    const page = filterDto.page || 1;
    const limit = filterDto.limit || 10;
    const skip = (page - 1) * limit;
    
    // Apply pagination
    query
      .skip(skip)
      .take(limit)
      .orderBy('center.createdAt', 'DESC'); // Sort by createdAt in descending order
    
    // Execute query
    const centers = await query.getMany();
    
    // For each center, find associated users with CENTER role
    const centersWithUsers: CenterWithUsersDto[] = [];
    
    for (const center of centers) {
      // Find all user-center relationships for this center
      const userCenters = await this.userCenterRepository.find({
        where: { center: { id: center.id } },
        relations: ['user'],
      });
      
      // Filter users with CENTER role
      const centerUsers = userCenters
        .filter(uc => uc.user.role === UserRole.CENTER)
        .map(uc => uc.user);
      
      // Generate signed URL for the logo if it exists
      let logoUrl = null;
      if (center.logo) {
        try {
          logoUrl = await this.s3Service.getSignedUrl(center.logo);
        } catch (error) {
          console.error(`Error generating signed URL for logo of center ${center.id}:`, error);
        }
      }
      
      // Create the extended center object with users
      const centerWithUsers: CenterWithUsersDto = {
        id: center.id,
        name: center.name,
        code: center.code,
        address: center.address,
        logo: center.logo,
        logoUrl: logoUrl,
        createdAt: center.createdAt,
        updatedAt: center.updatedAt,
        users: centerUsers,
      };
      
      centersWithUsers.push(centerWithUsers);
    }
    
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
    const response = new PaginatedCenterDto();
    response.data = centersWithUsers;
    response.meta = meta;
    
    return response;
  }

  async findOne(id: string): Promise<Center> {
    const center = await this.centerRepository.findOne({ where: { id } });
    if (!center) {
      throw new NotFoundException(`Center with ID '${id}' not found`);
    }
    
    // Generate signed URL for the logo if it exists
    if (center.logo) {
      try {
        const signedUrl = await this.s3Service.getSignedUrl(center.logo);
        // Temporarily add the signed URL to the center object (not persisted)
        (center as any).logoUrl = signedUrl;
      } catch (error) {
        console.error('Error generating signed URL for logo:', error);
      }
    }
    
    return center;
  }

  async findByCode(code: string): Promise<Center> {
    const center = await this.centerRepository.findOne({ where: { code } });
    if (!center) {
      throw new NotFoundException(`Center with code '${code}' not found`);
    }
    
    // Generate signed URL for the logo if it exists
    if (center.logo) {
      try {
        const signedUrl = await this.s3Service.getSignedUrl(center.logo);
        // Temporarily add the signed URL to the center object (not persisted)
        (center as any).logoUrl = signedUrl;
      } catch (error) {
        console.error('Error generating signed URL for logo:', error);
      }
    }
    
    return center;
  }

  async update(id: string, updateCenterDto: UpdateCenterDto, logoFile?: Express.Multer.File): Promise<Center> {
    const center = await this.findOne(id);

    // Check if code is being changed and if it conflicts
    if (updateCenterDto.code && updateCenterDto.code !== center.code) {
      const existingCenter = await this.centerRepository.findOne({
        where: { code: updateCenterDto.code },
      });

      if (existingCenter) {
        throw new ConflictException('Center with this code already exists');
      }
    }

    // Update center fields
    Object.assign(center, updateCenterDto);
    
    // Upload new logo if provided
    if (logoFile) {
      try {
        const fileName = `${center.id}-center-logo`;
        const folderPath = `centers/${center.id}`;
        
        // Delete old logo if exists
        if (center.logo) {
          try {
            await this.s3Service.deleteFile(center.logo);
          } catch (error) {
            console.error('Error deleting old logo:', error);
          }
        }
        
        const logoKey = await this.s3Service.uploadImage(logoFile, folderPath, fileName);
        center.logo = logoKey;
      } catch (error) {
        console.error('Error uploading new logo:', error);
      }
    }
    
    await this.centerRepository.save(center);
    
    // Generate signed URL for the logo if it exists
    if (center.logo) {
      try {
        const signedUrl = await this.s3Service.getSignedUrl(center.logo);
        // Temporarily add the signed URL to the center object (not persisted)
        (center as any).logoUrl = signedUrl;
      } catch (error) {
        console.error('Error generating signed URL for logo:', error);
      }
    }
    
    return center;
  }

  async remove(id: string): Promise<void> {
    const center = await this.findOne(id);
    await this.centerRepository.remove(center);
  }

  /**
   * Creates a center and an associated user with CENTER role
   * Also creates a user-center relationship automatically
   * @param createCenterWithUserDto The data for the center and user
   * @param logoFile Optional logo file for the center
   * @param signatureFile Optional signature file for the user
   * @returns The created center and user with auth tokens
   */
  /**
   * Creates a center and an associated user with CENTER role in a single atomic transaction
   * If any part of the operation fails, all changes are rolled back
   * @param createCenterWithUserDto The data for the center and user
   * @param logoFile Optional logo file for the center
   * @param signatureFile Optional signature file for the user
   * @returns The created center and user with auth tokens
   */
  async createWithUser(
    createCenterWithUserDto: CreateCenterWithUserDto,
    logoFile?: Express.Multer.File,
    signatureFile?: Express.Multer.File
  ): Promise<{ center: Center; user: any; authTokens: any }> {
    // First validate the center code uniqueness before starting any operations
    const existingCenter = await this.centerRepository.findOne({
      where: { code: createCenterWithUserDto.center.code }
    });
    
    if (existingCenter) {
      throw new ConflictException(`Center with code ${createCenterWithUserDto.center.code} already exists`);
    }
    
    // Check if user already exists with the email or username
    const userExists = await this.userRepository.findOne({
      where: [
        { email: createCenterWithUserDto.user.email },
        { username: createCenterWithUserDto.user.username },
      ],
    });

    if (userExists) {
      throw new ConflictException('User with this email or username already exists');
    }
    
    // Use a transaction to ensure atomicity
    const queryRunner = this.centerRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    let user;
    let authTokens;
    let center;
    let cognitoId;
    
    try {
      // ============ CREATE CENTER ============
      // Create center entity within the transaction
      const centerRepository = queryRunner.manager.getRepository(Center);
      const centerEntity = centerRepository.create(createCenterWithUserDto.center);
      
      // Handle logo file if provided
      if (logoFile) {
        try {
          const logoKey = `center-logos/${createCenterWithUserDto.center.code}-${Date.now()}`;
          const fileBuffer = logoFile.buffer;
          const mimeType = logoFile.mimetype;
          
          const logoUrl = await this.s3Service.uploadFile(fileBuffer, logoKey, mimeType);
          centerEntity.logo = logoUrl;
        } catch (error) {
          console.error('Error uploading logo file:', error);
          throw new InternalServerErrorException('Failed to upload center logo');
        }
      }
      
      // Save the center
      center = await centerRepository.save(centerEntity);
      
      try {
        // ============ CREATE USER IN COGNITO ============
        // We must create the Cognito user first (can't be in transaction)
        const cognitoService = this.userService['cognitoService']; // Access private property
        
        cognitoId = await cognitoService.createUser(
          createCenterWithUserDto.user.username,
          createCenterWithUserDto.user.password,
          createCenterWithUserDto.user.email,
          createCenterWithUserDto.user.name
        );
        
        // ============ CREATE USER IN DATABASE ============
        // Create user entity directly within the transaction
        const userRepository = queryRunner.manager.getRepository(User);
        const userEntity = userRepository.create({
          name: createCenterWithUserDto.user.name,
          role: UserRole.CENTER,
          email: createCenterWithUserDto.user.email,
          username: createCenterWithUserDto.user.username,
          mobileNumber: createCenterWithUserDto.user.mobileNumber,
          prices: createCenterWithUserDto.user.prices,
          cognitoId: cognitoId,
          status: UserStatus.ACTIVE
        });
        
        // Save the user
        user = await userRepository.save(userEntity);
        
        // Handle signature file if provided
        if (signatureFile) {
          try {
            const s3Service = this.userService['s3Service']; // Access private property
            const signatureKey = `user-signatures/${user.id}-${Date.now()}`;
            
            // Upload to S3
            const fileBuffer = signatureFile.buffer;
            const mimeType = signatureFile.mimetype;
            
            const signatureUrl = await s3Service.uploadFile(fileBuffer, signatureKey, mimeType);
            
            // Update user with signature URL
            user.signatureUrl = signatureUrl;
            await userRepository.save(user);
          } catch (error) {
            console.error('Error uploading signature file:', error);
            // Continue even if signature upload fails
          }
        }

        // ============ CREATE USER-CENTER RELATIONSHIP ============
        // Create user-center relationship within the transaction
        const userCenterRepository = queryRunner.manager.getRepository(UserCenter);
        const userCenterEntity = userCenterRepository.create({
          user: { id: user.id },
          center: { id: center.id }
        });
        
        await userCenterRepository.save(userCenterEntity);
        
        // ============ GET AUTH TOKENS ============
        // Authenticate the user to get auth tokens
        authTokens = await cognitoService.authenticateUser(
          createCenterWithUserDto.user.username,
          createCenterWithUserDto.user.password
        );
        
        // If we reach here, both center and user were created successfully
        await queryRunner.commitTransaction();
        
        return { center, user, authTokens };
      } catch (userError) {
        // If user creation fails, we need to roll back and clean up
        console.error('Error creating user:', userError);
        
        // If we created a Cognito user but failed later, try to clean up
        if (cognitoId) {
          try {
            const cognitoService = this.userService['cognitoService'];
            // Try to delete the Cognito user since we're rolling back the transaction
            await cognitoService.deleteUser(createCenterWithUserDto.user.username);
          } catch (cognitoCleanupError) {
            console.error('Failed to clean up Cognito user:', cognitoCleanupError);
          }
        }
        
        throw new InternalServerErrorException(`Failed to create user: ${userError.message}`);
      }
      
    } catch (error) {
      // Roll back the transaction if any part fails
      await queryRunner.rollbackTransaction();
      
      // If it's already a formatted exception, rethrow it
      if (error instanceof ConflictException || error instanceof InternalServerErrorException || error instanceof BadRequestException) {
        throw error;
      }
      
      // Otherwise, wrap in a generic error
      throw new InternalServerErrorException(
        `Failed to create center with user: ${error.message}`
      );
    } finally {
      // Always release the query runner
      await queryRunner.release();
    }
  }
}
