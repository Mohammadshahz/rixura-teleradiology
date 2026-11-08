import { Injectable, Logger, UnauthorizedException, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { CognitoService } from './cognito.service';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from '../dto/login.dto';
import { TokenResponseDto } from '../dto/token-response.dto';
import { CenterLoginDto } from '../dto/center-login.dto';
import { CenterTokenResponseDto } from '../dto/center-token-response.dto';
import { AdminLoginDto } from '../dto/admin-login.dto';
import { AdminTokenResponseDto } from '../dto/admin-token-response.dto';
import { UserRole } from '../enums/user-role.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Center } from '../../center/entities/center.entity';
import { UserCenter } from '../../center/entities/user-center.entity';
import { DirectPasswordResetDto } from '../dto/direct-password-reset.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private cognitoService: CognitoService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(Center)
    private centerRepository: Repository<Center>,
    @InjectRepository(UserCenter)
    private userCenterRepository: Repository<UserCenter>,
  ) {
    this.logger.log('AuthService initialized');
  }

  
  async directPasswordReset(resetDto: DirectPasswordResetDto): Promise<{ message: string }> {
    try {
      this.logger.log(`Direct password reset request for user: ${resetDto.username}`);
      
      // Validate the passwords match
      if (resetDto.newPassword !== resetDto.confirmPassword) {
        this.logger.warn(`Password reset failed: Passwords do not match for user ${resetDto.username}`);
        throw new BadRequestException('New password and confirmation password do not match');
      }
      
      // Check if user exists in our database
      try {
        await this.userService.findByUsername(resetDto.username);
      } catch (error) {
        if (error instanceof NotFoundException) {
          this.logger.warn(`Password reset attempted for non-existent user: ${resetDto.username}`);
          throw new BadRequestException('Invalid username or user not found');
        }
        throw error;
      }
      
      // Reset password directly with Cognito
      await this.cognitoService.directPasswordReset(
        resetDto.username,
        resetDto.newPassword
      );
      
      this.logger.log(`Password successfully reset for user: ${resetDto.username}`);
      
      return {
        message: 'Your password has been successfully reset.'
      };
    } catch (error) {
      this.logger.error(`Failed to reset password: ${error.message}`, error.stack);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to reset password. Please try again.');
    }
  }

  async login(loginDto: LoginDto): Promise<TokenResponseDto> {
    try {
      this.logger.log(`Attempting login for user: ${loginDto.username}`);
      
      // Authenticate with Cognito
      const cognitoTokens = await this.cognitoService.authenticateUser(
        loginDto.username,
        loginDto.password
      );
      
      // Find user in our database
      const user = await this.userService.findByUsername(loginDto.username);
      
      // Generate our own JWT tokens (we'll use Cognito's tokens for validation only)

      // Verify user is a CENTER role
      if (user.role !== UserRole.RADIOLOGIST) {
        this.logger.warn(`User ${loginDto.username} is not a RADIOLOGIST role (${user.role})`);
        throw new UnauthorizedException('Only RADIOLOGIST role users can login to centers');
      }
      const payload = {
        sub: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      };
      
      const accessToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('TOKEN_EXPIRY') || '7d',
      });
      
      const refreshToken = this.jwtService.sign(
        { sub: user.id },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRY') || '30d',
        }
      );
      
      this.logger.log(`User ${loginDto.username} successfully logged in`);
      
      return {
        accessToken,
        refreshToken,
        userId: user.id,
        role: user.role,
        username: user.username,
      };
    } catch (error) {
      this.logger.error(`Login failed for user ${loginDto.username}: ${error.message}`, error.stack);
      throw new UnauthorizedException('Invalid username or password');
    }
  }
  
  async validateToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch (error) {
      this.logger.error(`Token validation failed: ${error.message}`);
      throw new UnauthorizedException('Invalid token');
    }
  }

  async loginToCenter(centerLoginDto: CenterLoginDto): Promise<CenterTokenResponseDto> {
    try {
      this.logger.log(`Attempting center login for user: ${centerLoginDto.username}`);

      // Authenticate with Cognito
      const cognitoTokens = await this.cognitoService.authenticateUser(
        centerLoginDto.username,
        centerLoginDto.password
      );
      
      // Find user in our database
      const user = await this.userService.findByUsername(centerLoginDto.username);

      // Verify user is a CENTER role
      if (user.role !== UserRole.CENTER) {
        this.logger.warn(`User ${centerLoginDto.username} is not a CENTER role (${user.role})`);
        throw new UnauthorizedException('Only CENTER role users can login to centers');
      }

      // Find user's associated centers
      const userCenters = await this.userCenterRepository.find({
        where: { user: { id: user.id } },
        relations: ['user', 'center'],
      });

      if (!userCenters || userCenters.length === 0) {
        this.logger.warn(`User ${centerLoginDto.username} is not associated with any center`);
        throw new BadRequestException(`User is not associated with any center`);
      }

      // Use the first center if multiple are associated (could be enhanced to handle multiple centers)
      const userCenter = userCenters[0];
      const center = userCenter.center;

      // Generate our own JWT tokens with center information
      const payload = {
        sub: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        centerId: center.id,
      };
      
      const accessToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('TOKEN_EXPIRY') || '7d',
      });
      
      const refreshToken = this.jwtService.sign(
        { sub: user.id, centerId: center.id },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRY') || '30d',
        }
      );
      
      this.logger.log(`User ${centerLoginDto.username} successfully logged in to center ${center.name}`);
      
      return {
        accessToken,
        refreshToken,
        userId: user.id,
        role: user.role,
        username: user.username,
        centerId: center.id,
        centerName: center.name,
        centerCode: center.code,
        tokenType: 'Bearer',
      };
    } catch (error) {
      if (error instanceof UnauthorizedException || 
          error instanceof BadRequestException || 
          error instanceof NotFoundException) {
        throw error;
      }
      
      this.logger.error(`Center login failed for user ${centerLoginDto.username}: ${error.message}`, error.stack);
      throw new UnauthorizedException('Invalid username or password');
    }
  }

  async adminLogin(adminLoginDto: AdminLoginDto): Promise<AdminTokenResponseDto> {
    try {
      this.logger.log(`Attempting admin login for user: ${adminLoginDto.username}`);
      
      // Authenticate with Cognito
      const cognitoTokens = await this.cognitoService.authenticateUser(
        adminLoginDto.username,
        adminLoginDto.password
      );
      
      // Find user in our database
      const user = await this.userService.findByUsername(adminLoginDto.username);

      // Verify user is an ADMIN role
      if (user.role !== UserRole.ADMIN) {
        this.logger.warn(`User ${adminLoginDto.username} is not an ADMIN role (${user.role})`);
        throw new UnauthorizedException('Only ADMIN role users can access the admin endpoints');
      }
      
      // Generate JWT tokens with admin information
      const payload = {
        sub: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isAdmin: true
      };
      
      const accessToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('TOKEN_EXPIRY') || '7d',
      });
      
      const refreshToken = this.jwtService.sign(
        { sub: user.id, isAdmin: true },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRY') || '30d',
        }
      );
      
      // Record last login time (implementation could be expanded)
      const lastLogin = new Date().toISOString();
      
      this.logger.log(`Admin user ${adminLoginDto.username} successfully logged in`);
      
      // Define admin permissions based on their role
      const adminPermissions = [
        'user_management',
        'center_management',
        'report_access',
        'system_settings'
      ];
      
      return {
        accessToken,
        refreshToken,
        userId: user.id,
        role: user.role,
        username: user.username,
        tokenType: 'Bearer',
        adminAccess: {
          permissions: adminPermissions,
          lastLogin
        }
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      this.logger.error(`Admin login failed for user ${adminLoginDto.username}: ${error.message}`, error.stack);
      throw new UnauthorizedException('Invalid username or password');
    }
  }
}
