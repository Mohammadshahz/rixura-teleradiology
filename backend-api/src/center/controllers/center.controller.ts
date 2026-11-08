import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { FormDataJson } from '../../common/decorators/form-data-json.decorator';
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiQuery, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { CenterService } from '../services/center.service';
import { CreateCenterDto } from '../dto/create-center.dto';
import { UpdateCenterDto } from '../dto/update-center.dto';
import { Center } from '../entities/center.entity';
import { CreateCenterWithUserDto } from '../dto/create-center-with-user.dto';
import { FilterCenterDto } from '../dto/filter-center.dto';
import { PaginatedCenterDto } from '../dto/paginated-center.dto';
import { User } from '../../user/entities/user.entity';

@ApiTags('Centers')
@Controller('centers')
export class CenterController {
  constructor(private readonly centerService: CenterService) {}

  @Post()
  @UseInterceptors(FileInterceptor('logo'))
  @ApiOperation({ summary: 'Create a new center' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'City Medical Center' },
        code: { type: 'string', example: 'CMC001' },
        address: { type: 'string', example: '123 Medical Plaza, City, State, ZIP' },
        logo: { type: 'string', format: 'binary', description: 'Center logo image file' },
        website: { type: 'string', example: 'https://www.medicalcenter.com', description: 'Center website URL' },
        phoneNumbers: { type: 'string', example: '+911234567890', description: 'Center phone number' },
        centerScopes: { 
          type: 'array', 
          items: { type: 'string' }, 
          example: ['Radiology', 'Cardiology', 'Neurology'],
          description: 'Center specialties or scopes'
        }
      },
      required: ['name', 'code']
    }
  })
  @ApiResponse({ status: 201, description: 'The center has been successfully created.', type: Center })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 409, description: 'Center with this code already exists.' })
  async create(
    @Body() createCenterDto: CreateCenterDto,
    @UploadedFile() logo?: Express.Multer.File
  ): Promise<Center> {
    return await this.centerService.create(createCenterDto, logo);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all centers with optional pagination and associated users',
    description: 'Returns centers with optional pagination and includes users associated with each center through the user-center relationship, filtered to only show users with CENTER role.'
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter centers by name (case insensitive, partial match)'
  })
  @ApiQuery({
    name: 'code',
    required: false,
    description: 'Filter centers by code (case insensitive, partial match)'
  })
  @ApiQuery({
    name: 'address',
    required: false,
    description: 'Filter centers by address (case insensitive, partial match)'
  })
  @ApiQuery({
    name: 'website',
    required: false,
    description: 'Filter centers by website (case insensitive, partial match)'
  })
  @ApiQuery({
    name: 'phoneNumbers',
    required: false,
    description: 'Filter centers by phone number (case insensitive, partial match)'
  })
  @ApiQuery({
    name: 'centerScopes',
    required: false,
    description: 'Filter centers by scope/specialty (case insensitive, partial match)'
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (1-based)',
    type: Number
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    type: Number
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns centers with associated CENTER users, paginated if pagination parameters are provided',
    type: PaginatedCenterDto 
  })
  async findAll(@Query() filterDto: FilterCenterDto): Promise<PaginatedCenterDto> {
    return await this.centerService.findAllPaginated(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a center by id' })
  @ApiResponse({ status: 200, description: 'Return the center.', type: Center })
  @ApiResponse({ status: 404, description: 'Center not found.' })
  async findOne(@Param('id') id: string): Promise<Center> {
    return await this.centerService.findOne(id);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get a center by code' })
  @ApiResponse({ status: 200, description: 'Return the center.', type: Center })
  @ApiResponse({ status: 404, description: 'Center not found.' })
  async findByCode(@Param('code') code: string): Promise<Center> {
    return await this.centerService.findByCode(code);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('logo'))
  @ApiOperation({ summary: 'Update a center' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Updated Medical Center' },
        code: { type: 'string', example: 'UMC002' },
        address: { type: 'string', example: '456 Medical Boulevard, City, State, ZIP' },
        logo: { type: 'string', format: 'binary', description: 'Center logo image file' },
        website: { type: 'string', example: 'https://www.updatedcenter.com', description: 'Updated website URL' },
        phoneNumbers: { type: 'string', example: '+911234567890', description: 'Updated phone number' },
        centerScopes: { 
          type: 'array', 
          items: { type: 'string' }, 
          example: ['Radiology', 'Cardiology', 'Orthopedics'],
          description: 'Updated specialties or scopes'
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'The center has been successfully updated.', type: Center })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Center not found.' })
  @ApiResponse({ status: 409, description: 'Center with this code already exists.' })
  async update(
    @Param('id') id: string, 
    @FormDataJson() updateCenterDto: UpdateCenterDto,
    @UploadedFile() logo?: Express.Multer.File
  ): Promise<Center> {
    console.log('Updating center with data:', updateCenterDto);
    return await this.centerService.update(id, updateCenterDto, logo);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a center' })
  @ApiResponse({ status: 200, description: 'The center has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Center not found.' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.centerService.remove(id);
  }

  @Post('with-user')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logo', maxCount: 1 },
      { name: 'signature', maxCount: 1 },
    ])
  )
  @ApiOperation({ summary: 'Create a new center with an admin user' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        center: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'ABC Medical Center' },
            code: { type: 'string', example: 'ABC001' },
            address: { type: 'string', example: '123 Main St, City, State' },
            website: { type: 'string', example: 'https://www.abcmedical.com', description: 'Center website URL' },
            phoneNumbers: { type: 'string', example: '+911234567890', description: 'Center phone number' },
            centerScopes: { 
              type: 'array', 
              items: { type: 'string' }, 
              example: ['Radiology', 'Cardiology', 'Neurology'],
              description: 'Center specialties or scopes'
            }
          }
        },
        user: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Center Admin' },
            email: { type: 'string', format: 'email', example: 'admin@abcmedical.com' },
            username: { type: 'string', example: 'abc_admin' },
            password: { type: 'string', example: 'Password123!' },
            mobileNumber: { type: 'string', example: '+911234567890' },
            address: { type: 'string', example: '123 Main St, City, State' },
            prices: {
              type: 'object',
              properties: {
                'CT-SCAN': { 
                  type: 'object',
                  properties: {
                    regular: { type: 'number', example: 1000 },
                    review: { type: 'number', example: 500 }
                  }
                },
                'XRAY': { 
                  type: 'object',
                  properties: {
                    regular: { type: 'number', example: 500 },
                    review: { type: 'number', example: 250 }
                  }
                },
                'MRI': { 
                  type: 'object',
                  properties: {
                    regular: { type: 'number', example: 2000 },
                    review: { type: 'number', example: 1000 }
                  }
                }
              },
              description: 'Pricing for different X-ray types with regular and review rates'
            },
          }
        },
        logo: { type: 'string', format: 'binary', description: 'Optional logo image file for the center' },
        signature: { type: 'string', format: 'binary', description: 'Optional signature image file for the center user' },
      },
      required: ['center', 'user']
    }
  })
  @ApiResponse({
    status: 201,
    description: 'The center and user have been successfully created.',
    schema: {
      properties: {
        center: { $ref: '#/components/schemas/Center' },
        user: { $ref: '#/components/schemas/User' },
        authTokens: {
          type: 'object',
          properties: {
            idToken: { type: 'string' },
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 409, description: 'Center or user already exists.' })
  async createWithUser(
    @FormDataJson(['center', 'user']) parsedData: { center: any; user: any },
    @UploadedFiles() files: { logo?: Express.Multer.File[], signature?: Express.Multer.File[] }
  ): Promise<{ center: Center; user: User; authTokens: any }> {
    console.log('Parsed center data:', parsedData.center);
    console.log('Parsed user data:', parsedData.user);
    console.log('Files:', files);
    
    // Create a properly structured DTO
    const createCenterWithUserDto: CreateCenterWithUserDto = {
      center: parsedData.center,
      user: parsedData.user
    };
    
    const logoFile = files?.logo?.[0];
    const signatureFile = files?.signature?.[0];
    
    return await this.centerService.createWithUser(createCenterWithUserDto, logoFile, signatureFile);
  }
}
