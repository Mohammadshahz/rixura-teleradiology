import { Body, Controller, HttpCode, Post, Logger, BadRequestException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { TokenResponseDto } from '../dto/token-response.dto';
import { CenterLoginDto } from '../dto/center-login.dto';
import { CenterTokenResponseDto } from '../dto/center-token-response.dto';
import { AdminLoginDto } from '../dto/admin-login.dto';
import { AdminTokenResponseDto } from '../dto/admin-token-response.dto';
import { DirectPasswordResetDto } from '../dto/direct-password-reset.dto';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: TokenResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginDto: LoginDto): Promise<TokenResponseDto> {
    this.logger.log(`Login attempt for user: ${loginDto.username}`);
    return this.authService.login(loginDto);
  }

  @Post('center-login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Center user login - automatically fetches center details' })
  @ApiResponse({
    status: 200,
    description: 'Center login successful',
    type: CenterTokenResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request - User is not associated with any center' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid credentials or user not a CENTER role' })
  @ApiResponse({ status: 404, description: 'Not Found - Center not found' })
  async loginToCenter(@Body() centerLoginDto: CenterLoginDto): Promise<CenterTokenResponseDto> {
    this.logger.log(`Center login attempt for user: ${centerLoginDto.username}`);
    return this.authService.loginToCenter(centerLoginDto);
  }

  @Post('admin-login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Admin user login - specifically for ADMIN role users' })
  @ApiResponse({
    status: 200,
    description: 'Admin login successful',
    type: AdminTokenResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid credentials or user not an ADMIN role' })
  async adminLogin(@Body() adminLoginDto: AdminLoginDto): Promise<AdminTokenResponseDto> {
    this.logger.log(`Admin login attempt for user: ${adminLoginDto.username}`);
    return this.authService.adminLogin(adminLoginDto);
  }

  @Post('direct-reset-password')
  @HttpCode(200)
  @ApiOperation({ summary: 'Directly reset password without confirmation code' })
  @ApiResponse({
    status: 200,
    description: 'Password reset successful',
    schema: {
      properties: {
        message: { type: 'string', example: 'Your password has been successfully reset.' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid username, passwords do not match, or other errors' })
  async directPasswordReset(@Body() resetDto: DirectPasswordResetDto): Promise<{ message: string }> {
    this.logger.log(`Direct password reset attempt for user: ${resetDto.username}`);
    return this.authService.directPasswordReset(resetDto);
  }
}
