import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateTemplateDto } from './dto/create-template.dto';
import { FilterTemplateDto } from './dto/filter-template.dto';
import { PaginatedTemplateDto } from './dto/paginated-template.dto';
import { TemplateResponseDto } from './dto/template-response.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { TemplateService } from './template.service';
import { TemplateType } from './enums/template-type.enum';

@ApiTags('templates')
@Controller('templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @ApiOperation({
    summary: 'Create a new template',
    description: 'Creates a new template with the given data and returns it',
  })
  @ApiCreatedResponse({
    description: 'The template has been successfully created',
    type: TemplateResponseDto,
  })
  @Post()
  async create(@Body() createTemplateDto: CreateTemplateDto): Promise<TemplateResponseDto> {
    return this.templateService.create(createTemplateDto);
  }

  @ApiOperation({
    summary: 'Get all templates with optional filtering and pagination',
    description: 'Retrieves templates with support for filtering by title and type, and pagination',
  })
  @ApiQuery({
    type: FilterTemplateDto
  })
  @ApiOkResponse({
    description: 'Returns templates, optionally paginated with filter criteria applied',
    schema: {
      oneOf: [
        { type: 'array', items: { $ref: '#/components/schemas/TemplateResponseDto' } },
        { $ref: '#/components/schemas/PaginatedTemplateDto' }
      ]
    }
  })
  @Get()
  async findAll(@Query() filterDto?: FilterTemplateDto): Promise<TemplateResponseDto[] | PaginatedTemplateDto> {
    return this.templateService.findAll(filterDto);
  }

  @ApiOperation({
    summary: 'Get templates by radiologist ID',
    description: 'Retrieves all templates associated with a specific radiologist',
  })
  @ApiOkResponse({
    description: 'Returns templates for the specified radiologist',
    type: [TemplateResponseDto],
  })
  @ApiParam({ name: 'radiologistId', description: 'The UUID of the radiologist', type: String })
  @Get('radiologist/:radiologistId')
  async findByRadiologist(@Param('radiologistId', ParseUUIDPipe) radiologistId: string): Promise<TemplateResponseDto[]> {
    return this.templateService.findAllByRadiologist(radiologistId);
  }

  @ApiOperation({
    summary: 'Get a template by ID',
    description: 'Retrieves a template by its ID',
  })
  @ApiOkResponse({
    description: 'Returns the template with the specified ID',
    type: TemplateResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Template with the specified ID not found' })
  @ApiParam({ name: 'id', description: 'The UUID of the template', type: String })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<TemplateResponseDto> {
    return this.templateService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update a template',
    description: 'Updates a template with the given data and returns it',
  })
  @ApiOkResponse({
    description: 'The template has been successfully updated',
    type: TemplateResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Template with the specified ID not found' })
  @ApiParam({ name: 'id', description: 'The UUID of the template to update', type: String })
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ): Promise<TemplateResponseDto> {
    return this.templateService.update(id, updateTemplateDto);
  }

  @ApiOperation({
    summary: 'Delete a template',
    description: 'Deletes the template with the specified ID',
  })
  @ApiNoContentResponse({ description: 'The template has been successfully deleted' })
  @ApiNotFoundResponse({ description: 'Template with the specified ID not found' })
  @ApiParam({ name: 'id', description: 'The UUID of the template to delete', type: String })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.templateService.remove(id);
  }
}
