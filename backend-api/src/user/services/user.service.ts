import { Injectable, NotFoundException, ConflictException, BadRequestException, InternalServerErrorException, UnsupportedMediaTypeException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { FilterUserDto } from '../dto/filter-user.dto';
import { UserRole } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';
import { CognitoService } from './cognito.service';
import { UserCenterService } from '../../center/services/user-center.service';
import { S3Service } from '../../aws/s3.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private cognitoService: CognitoService,
    private userCenterService: UserCenterService,
    private s3Service: S3Service,
  ) {}

  async createAdmin(createAdminDto: CreateAdminDto): Promise<{ user: User; authTokens: any }> {
    // Check if user already exists
    const userExists = await this.userRepository.findOne({
      where: [
        { email: createAdminDto.email },
        { username: createAdminDto.username },
      ],
    });

    if (userExists) {
      throw new ConflictException('User with this email or username already exists');
    }

    try {
      // Create user in Cognito
      const cognitoId = await this.cognitoService.createUser(
        createAdminDto.username,
        createAdminDto.password,
        createAdminDto.email,
        createAdminDto.name,
      );

      // Create admin user in database with role set to ADMIN
      const user = this.userRepository.create({
        name: createAdminDto.name,
        role: UserRole.ADMIN,
        email: createAdminDto.email,
        username: createAdminDto.username,
        mobileNumber: createAdminDto.mobileNumber,
        address: createAdminDto.address,
        signatureUrl: null,
        prices: null,
        cognitoId: cognitoId,
        status: createAdminDto.status || UserStatus.ACTIVE
      });

      const savedUser = await this.userRepository.save(user);

      // Authenticate the user to get auth tokens
      const authTokens = await this.cognitoService.authenticateUser(
        createAdminDto.username,
        createAdminDto.password
      );
      
      return {
        user: savedUser,
        authTokens
      };
    } catch (error) {
      // If there was an error, clean up any partial resources
      throw new InternalServerErrorException(`Failed to create admin user: ${error.message}`);
    }
  }

  async create(createUserDto: CreateUserDto, centerId?: string, signatureFile?: Express.Multer.File): Promise<{ user: User; authTokens: any }> {
    // Check if the role is CENTER, centerId is required
    if (createUserDto.role === UserRole.CENTER && !centerId) {
      throw new BadRequestException('centerId is required when role is CENTER');
    }
    
    // If role is CENTER and centerId is provided, check if the center already has a CENTER role user
    if (createUserDto.role === UserRole.CENTER && centerId) {
      // Check if any user-center relationships exist for this center where user has CENTER role
      const existingCenterUsers = await this.userCenterService.findUsersByCenterId(centerId);
      
      // Filter users to find those with CENTER role
      const centerRoleUsers = existingCenterUsers.filter(uc => uc.user.role === UserRole.CENTER);
      
      if (centerRoleUsers.length > 0) {
        throw new ConflictException('This center already has a user with CENTER role. Only one CENTER role user is allowed per center.');
      }
    }
    
    // Check if user already exists
    const userExists = await this.userRepository.findOne({
      where: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });

    if (userExists) {
      throw new ConflictException('User with this email or username already exists');
    }

    try {
      // Upload signature file if provided
      if (signatureFile) {
        try {
          // Validate file type
          this.validateSignatureFileType(signatureFile);
          
          // We'll upload the file after user creation to get the correct userId
          // Store the file in memory to use after user creation
        } catch (error) {
          console.error('Error validating signature file:', error);
          // Continue user creation even if signature validation fails
        }
      }

      // Create user in Cognito
      const cognitoId = await this.cognitoService.createUser(
        createUserDto.username,
        createUserDto.password,
        createUserDto.email,
        createUserDto.name,
      );

      // Create user in database
      const user = this.userRepository.create({
        name: createUserDto.name,
        role: createUserDto.role,
        email: createUserDto.email,
        username: createUserDto.username,
        mobileNumber: createUserDto.mobileNumber,
        address: createUserDto.address,
        signatureUrl: createUserDto.signatureUrl,
        cognitoId: cognitoId,
        status: createUserDto.status || UserStatus.ACTIVE,
        prices: createUserDto.prices, // Include prices field
      });

      const savedUser = await this.userRepository.save(user);
      
      // Upload signature file if provided (now that we have the user ID)
      if (signatureFile) {
        try {
          // Upload signature file and get the S3 key
          const fileKey = await this.uploadSignatureFile(signatureFile, savedUser.id, savedUser.username);
          
          // Update the user with the S3 file key
          savedUser.signatureUrl = fileKey;
          await this.userRepository.save(savedUser);
        } catch (error) {
          console.error('Error uploading signature file:', error);
          // Continue even if signature upload fails
        }
      }
      
      // If user role is CENTER and centerId is provided, create a user-center relationship
      if (savedUser.role === UserRole.CENTER && centerId) {
        await this.createUserCenterRelation(savedUser.id, centerId);
      }
      
      // Authenticate the user to get auth tokens
      const authTokens = await this.cognitoService.authenticateUser(
        createUserDto.username,
        createUserDto.password
      );
      
      return {
        user: savedUser,
        authTokens
      };
    } catch (error) {
      // If there was an error, clean up any partial resources
      throw new InternalServerErrorException(`Failed to create user: ${error.message}`);
    }
  }

  /**
   * Find all users with optional filtering and pagination
   * @param filterDto Optional filters and pagination parameters
   * @returns Array of users when no pagination is requested, or paginated response when page and limit are both provided
   */
  async findAll(filterDto?: FilterUserDto): Promise<User[] | { data: User[]; total: number; page: number; limit: number; totalPages: number }> {
    // Build the where condition based on provided filters
    const whereCondition: any = {};
    
    if (filterDto) {
      if (filterDto.role) {
        whereCondition.role = filterDto.role;
      }
      
      if (filterDto.status) {
        whereCondition.status = filterDto.status;
      }
      
      if (filterDto.name) {
        whereCondition.name = ILike(`%${filterDto.name}%`);
      }
    }
    
    // Check if pagination is explicitly requested with both page and limit
    if (filterDto?.page !== undefined && filterDto?.limit !== undefined) {
      const page = filterDto.page;
      const limit = filterDto.limit;
      const skip = (page - 1) * limit;
      
      // Get total count for pagination metadata
      const total = await this.userRepository.count({ where: whereCondition });
      
      // Get paginated results
      const data = await this.userRepository.find({ 
        where: whereCondition,
        skip,
        take: limit,
        order: { createdAt: 'DESC' }
      });
      
      // Handle signature URLs
      if (filterDto && filterDto.fetchSignature) {
        // Convert S3 keys to signed URLs for client access
        await Promise.all(data.map(user => this.convertSignatureUrlToSignedUrl(user)));
      }
      // Calculate total pages
      const totalPages = Math.ceil(total / limit);
      
      // Return paginated response
      return {
        data,
        total,
        page,
        limit,
        totalPages
      };
    }
    
    // If no pagination, perform regular query
    let users: User[];
    
    // Apply filters if any are provided
    if (Object.keys(whereCondition).length > 0) {
      users = await this.userRepository.find({ 
        where: whereCondition,
        order: { createdAt: 'DESC' }
      });
    } else {
      // If no filters provided, return all users
      users = await this.userRepository.find({ order: { createdAt: 'DESC' } });
    }
    
    return users;
  }

  async findOne(id: string, fetchSignature: boolean = true): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }
    
    // Handle signature URL based on fetchSignature flag
    if (fetchSignature) {
      // Convert S3 key to signed URL if needed
      await this.convertSignatureUrlToSignedUrl(user);
    }
    
    return user;
  }

  async findByUsername(username: string, fetchSignature: boolean = true): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException(`User with username '${username}' not found`);
    }
    
    // Handle signature URL based on fetchSignature flag
    if (fetchSignature) {
      // Convert S3 key to signed URL if needed
      await this.convertSignatureUrlToSignedUrl(user);
    }
    
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto, signatureFile?: Express.Multer.File): Promise<User> {
    const user = await this.findOne(id);

    // Check if email or username is being changed and if they conflict
    if (updateUserDto.email || updateUserDto.username) {
      const existingUser = await this.userRepository.findOne({
        where: [
          updateUserDto.email ? { email: updateUserDto.email } : {},
          updateUserDto.username ? { username: updateUserDto.username } : {},
        ],
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email or username is already in use');
      }
    }

    // Handle signature file upload if provided
    if (signatureFile) {
      try {
        // Upload signature file and get the S3 key
        const fileKey = await this.uploadSignatureFile(signatureFile, id, user.username);
        
        // Add the fileKey to the update DTO
        updateUserDto.signatureUrl = fileKey;
      } catch (error) {
        console.error('Error uploading signature:', error);
        throw new InternalServerErrorException('Failed to upload signature image');
      }
    }

    // Update Cognito attributes if needed
    try {
      const cognitoAttributes: Record<string, string> = {};
      if (updateUserDto.email) cognitoAttributes.email = updateUserDto.email;
      if (updateUserDto.name) cognitoAttributes.name = updateUserDto.name;

      if (Object.keys(cognitoAttributes).length > 0) {
        await this.cognitoService.updateUserAttributes(user.username, cognitoAttributes);
      }
    } catch (error) {
      throw new InternalServerErrorException(`Failed to update Cognito user: ${error.message}`);
    }

    // Update database record
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  /**
   * Creates a relationship between a user and a center in the user_centers table
   */
  private async createUserCenterRelation(userId: string, centerId: string): Promise<void> {
    try {
      // Using the UserCenterService to handle the relationship creation
      await this.userCenterService.createUserCenterRelation(userId, centerId);
    } catch (error) {
      // Re-throw the error with a consistent message format
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error; // Preserve specific error types
      }
      throw new InternalServerErrorException(`Failed to create user-center relationship: ${error.message}`);
    }
  }
  
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);

    try {
      // Delete from Cognito first
      await this.cognitoService.deleteUser(user.username);

      // Then delete from database
      await this.userRepository.remove(user);
    } catch (error) {
      throw new InternalServerErrorException(`Failed to delete user: ${error.message}`);
    }
  }
  
  /**
   * Simple method to change a user's status (active/inactive)
   * Only updates database status without Cognito integration
   * @param id User ID
   * @param status New status to set
   * @returns Updated user object
   */
  async changeStatus(id: string, status: UserStatus): Promise<User> {
    const user = await this.findOne(id);

    if(!user){
      throw new NotFoundException(`User with ID '${id}' not found`);
    }
    
    // Update the user status in the database only
    user.status = status;
    
    // Save the updated user to the database
    return await this.userRepository.save(user);
  }

  /**
   * Upload a signature image for a user
   * @param id User ID
   * @param file Signature image file
   * @returns Updated signature URL
   */
  async uploadSignature(id: string, file: Express.Multer.File): Promise<{ signatureUrl: string }> {
    try {
      // Get the user to access username
      const user = await this.findOne(id, false); // Don't get signed URL yet
      
      // Use the reusable method to upload signature file and get S3 key
      const fileKey = await this.uploadSignatureFile(file, id, user.username);

      // Update user with the S3 file key
      user.signatureUrl = fileKey;
      await this.userRepository.save(user);
      
      // Get a signed URL to return to the client
      const signedUrl = await this.s3Service.getSignedUrl(fileKey);

      return { signatureUrl: signedUrl };
    } catch (error) {
      console.error('Error uploading signature:', error);
      throw new InternalServerErrorException('Failed to upload signature image');
    }
  }

  /**
   * Get a signed URL for accessing a user's signature image
   * @param userId User ID
   * @returns Signed URL for accessing the signature
   */
  async getSignedSignatureUrl(userId: string): Promise<string | null> {
    // Get user with raw S3 key, not already converted to signed URL
    const user = await this.findOne(userId, false);
    
    if (!user.signatureUrl) {
      return null;
    }
    
    try {
      // Get a signed URL from the S3 service using the stored fileKey
      const signedUrl = await this.s3Service.getSignedUrl(user.signatureUrl);
      return signedUrl;
    } catch (error) {
      console.error('Error getting signed signature URL:', error);
      throw new InternalServerErrorException('Failed to generate signature URL');
    }
  }
  
  /**
   * Helper method for converting an S3 key to a signed URL in a user object
   * @param user User object with signatureUrl property
   * @private
   */
  private async convertSignatureUrlToSignedUrl(user: User): Promise<void> {
    if (user.signatureUrl) {
      try {
        // Generate signed URL for the S3 key
        // Make sure we're working with a valid S3 key by removing any base URLs
        // that might have been accidentally prepended
        const bucketUrl = `https://${process.env.AWS_BUCKET_NAME || 'radiology-dev-resource'}.s3.${process.env.AWS_REGION || 'ap-south-1'}.amazonaws.com/`;
        
        // Handle both cases: when signatureUrl might be a full URL or just the path
        let s3Key = user.signatureUrl;
        if (s3Key.startsWith('http')) {
          // Handle if it's a full URL without token by extracting just the path
          const url = new URL(s3Key);
          s3Key = url.pathname.startsWith('/') ? url.pathname.substring(1) : url.pathname;
        }
        
        // Generate the signed URL
        const signedUrl = await this.s3Service.getSignedUrl(s3Key);
        console.log('Generated signed URL:', { userId: user.id, originalUrl: user.signatureUrl, signedUrl });
        
        // Replace the key with the signed URL
        user.signatureUrl = signedUrl;
      } catch (error) {
        console.error('Error generating signed URL for signature:', error);
        // Keep the original URL as is if an error occurs
      }
    } else {
      console.log('No signature URL to convert for user:', user.id);
    }
  }

  /**
   * Helper method to upload a signature file to S3
   * @param file The signature file to upload
   * @param userId User ID
   * @param username Username
   * @returns The S3 file key (to be stored in the database)
   * @private
   */
  private async uploadSignatureFile(file: Express.Multer.File, userId: string, username: string): Promise<string> {
    // Validate file type
    this.validateSignatureFileType(file);
    
    // Define the folder structure in S3: users/{userId}/
    const folder = `users/${userId}`;
    
    // Create consistent filename for easier management
    const customFilename = `${userId}-${username}-signature`;
    
    try {
      // Upload to S3 and get the file key
      const fileKey = await this.s3Service.uploadImage(file, folder, customFilename);
      console.log(`Signature uploaded successfully for user ${userId}, fileKey: ${fileKey}`);
      return fileKey;
    } catch (error) {
      console.error('Error in uploadSignatureFile:', error);
      throw new InternalServerErrorException('Failed to upload signature file');
    }
  }

  /**
   * Validate that the uploaded file is an accepted image type
   * @param file The file to validate
   */
  private validateSignatureFileType(file: Express.Multer.File): void {
    const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    
    if (!acceptedTypes.includes(file.mimetype)) {
      throw new UnsupportedMediaTypeException(
        `File type ${file.mimetype} is not supported. Only JPEG, JPG, and PNG are allowed.`
      );
    }

    // Optional: Add file size validation
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeInBytes) {
      throw new BadRequestException(
        `File too large. Maximum size is ${maxSizeInBytes / (1024 * 1024)}MB.`
      );
    }
  }
}
