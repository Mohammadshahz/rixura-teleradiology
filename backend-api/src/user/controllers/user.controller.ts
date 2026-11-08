import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  UseInterceptors,
  UploadedFile,
  Headers,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto, QueryCenter } from '../dto/create-user.dto';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { FilterUserDto } from '../dto/filter-user.dto';
import { UserStatus } from '../enums/user-status.enum';
import { UserRole } from '../enums/users.enum';
import { XRayType } from '../../report/enums/x-ray-type.enum';
import { GetUserDto } from '../dto/get-user.dto';
import { ChangeUserStatusDto } from '../dto/change-user-status.dto';
import { UploadSignatureDto } from '../dto/upload-signature.dto';
import { PaginatedUserDto } from '../dto/paginated-user.dto';
import { User } from '../entities/user.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiConsumes,
  ApiQuery,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/admin')
  @ApiOperation({ summary: 'Create a new admin user with prices and signature set to null' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Admin User' },
        email: { type: 'string', format: 'email', example: 'admin@example.com' },
        username: { type: 'string', example: 'adminuser' },
        password: { type: 'string', example: 'SecurePassword123!' },
        mobileNumber: { type: 'string', example: '+911234567890' },
        address: { type: 'string', example: '123 Admin St, City, State, ZIP' },
        status: { type: 'string', enum: Object.values(UserStatus), example: UserStatus.ACTIVE }
      },
      required: ['name', 'email', 'username', 'password']
    }
  })
  @ApiResponse({
    status: 201,
    description: 'The admin user has been successfully created with auth tokens.'
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 409, description: 'User with this email or username already exists.' })
  async createAdmin(@Body() createAdminDto: CreateAdminDto): Promise<{ user: User; authTokens: any }> {
    return this.userService.createAdmin(createAdminDto);
  }

  @Post()
  @UseInterceptors(FileInterceptor('signature'))
  @ApiOperation({ summary: 'Create a new user' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ 
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'John Doe' },
        role: { type: 'string', enum: Object.values(UserRole), example: UserRole.RADIOLOGIST },
        email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
        username: { type: 'string', example: 'johndoe' },
        password: { type: 'string', example: 'Password123!' },
        mobileNumber: { type: 'string', example: '+911234567890' },
        address: { type: 'string', example: '123 Main St, City, State, ZIP' },
        status: { type: 'string', enum: Object.values(UserStatus), example: UserStatus.ACTIVE },
        signature: { type: 'string', format: 'binary', description: 'Optional signature image file' },
        prices: { 
          type: 'object',
          properties: {
            [XRayType.CT_SCAN]: { 
              type: 'object',
              properties: {
                regular: { type: 'number', example: 50 },
                review: { type: 'number', example: 25 }
              }
            },
            [XRayType.XRAY]: { 
              type: 'object',
              properties: {
                regular: { type: 'number', example: 20 },
                review: { type: 'number', example: 10 }
              }
            },
            [XRayType.MRI]: { 
              type: 'object',
              properties: {
                regular: { type: 'number', example: 100 },
                review: { type: 'number', example: 50 }
              }
            }
          },
          description: 'Pricing for different X-ray types with regular and review rates'
        },
      },
      required: ['name', 'role', 'email', 'username', 'password']
    }
  })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created with auth tokens.',
    schema: {
      properties: {
        user: { $ref: '#/components/schemas/User' },
        authTokens: {
          type: 'object',
          properties: {
            idToken: { type: 'string' },
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
            expiresIn: { type: 'number' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 409, description: 'User with this email or username already exists.' })
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() signature?: Express.Multer.File,
    @Query() query?: QueryCenter
  ): Promise<{ user: User; authTokens: any }> {
    return this.userService.create(createUserDto, query?.centerId, signature);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users with optional filtering and pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of users, optionally filtered by role and/or status. Returns either a list of users or a paginated response.',
    schema: {
      oneOf: [
        { type: 'array', items: { $ref: '#/components/schemas/User' } },
        { $ref: '#/components/schemas/PaginatedUserDto' }
      ]
    }
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (1-based)',
    schema: { type: 'integer', default: 1 }
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    schema: { type: 'integer', default: 10 }
  })
  @ApiQuery({
    name: 'fetchSignature',
    required: false,
    description: 'Whether to fetch signature URLs or not (default: false)',
    schema: { type: 'boolean' }
  })
  findAll(@Query() filterUserDto: FilterUserDto): Promise<User[] | PaginatedUserDto> {
    return this.userService.findAll(filterUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiParam({
    name: 'fetchSignature',
    required: false,
    description: 'Whether to fetch signature URL or not (default: false)',
    schema: { type: 'boolean' }
  })
  @ApiResponse({
    status: 200,
    description: 'The user record',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findOne(
    @Param('id') id: string,
    @Query() query: GetUserDto
  ): Promise<User> {
    return this.userService.findOne(id, query.fetchSignature);
  }

  @Get('username/:username')
  @ApiOperation({ summary: 'Get a user by username' })
  @ApiParam({ name: 'username', description: 'Username' })
  @ApiParam({
    name: 'fetchSignature',
    required: false,
    description: 'Whether to fetch signature URL or not (default: false)',
    schema: { type: 'boolean' }
  })
  @ApiResponse({
    status: 200,
    description: 'The user record',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findByUsername(
    @Param('username') username: string,
    @Query() query: GetUserDto
  ): Promise<User> {
    return this.userService.findByUsername(username, query.fetchSignature);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('signature'))
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'John Doe' },
        email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
        mobileNumber: { type: 'string', example: '+911234567890' },
        address: { type: 'string', example: '123 Main St, City, State, ZIP' },
        status: { type: 'string', enum: Object.values(UserStatus), example: UserStatus.ACTIVE },
        signature: { type: 'string', format: 'binary', description: 'Optional signature image file' },
        prices: { 
          type: 'object',
          properties: {
            [XRayType.CT_SCAN]: { 
              type: 'object',
              properties: {
                regular: { type: 'number', example: 50 },
                review: { type: 'number', example: 25 }
              }
            },
            [XRayType.XRAY]: { 
              type: 'object',
              properties: {
                regular: { type: 'number', example: 20 },
                review: { type: 'number', example: 10 }
              }
            },
            [XRayType.MRI]: { 
              type: 'object',
              properties: {
                regular: { type: 'number', example: 100 },
                review: { type: 'number', example: 50 }
              }
            }
          },
          description: 'Pricing for different X-ray types with regular and review rates'
        },
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 409, description: 'Email or username is already in use.' })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() signature?: Express.Multer.File,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto, signature);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 204,
    description: 'The user has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }

  @Patch('/:id/status')
  @ApiOperation({ summary: 'Change a user\'s active/inactive status' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: ChangeUserStatusDto })
  @ApiResponse({
    status: 200,
    description: 'The user status has been successfully updated.',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Invalid status value or ID.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  changeStatus(
    @Param('id') id: string,
    @Body() statusDto: ChangeUserStatusDto,
  ): Promise<User> {
    return this.userService.changeStatus(id, statusDto.status);
  }


}
