import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { FindFeedbackDto } from './dto/find-feedback.dto';
import { FilterFeedbackDto } from './dto/filter-feedback.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { PaginatedFeedbackDto } from './dto/paginated-feedback.dto';
import { Feedback } from './entities/feedback.entity';

@ApiTags('Feedback')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new feedback' })
  @ApiBody({ type: CreateFeedbackDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Feedback has been successfully created.',
    type: Feedback,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.create(createFeedbackDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all feedbacks with optional filtering and pagination', 
    description: 'Returns feedbacks with optional pagination and includes user information. Can filter by username, user ID, and phone number.'
  })
  @ApiQuery({
    type: FindFeedbackDto
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Returns feedbacks, optionally paginated with user information',
    schema: {
      oneOf: [
        { type: 'array', items: { $ref: '#/components/schemas/Feedback' } },
        { $ref: '#/components/schemas/PaginatedFeedbackDto' }
      ]
    }
  })
  findAll(@Query() findFeedbackDto: FindFeedbackDto) {
    return this.feedbackService.findAll(findFeedbackDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific feedback by ID' })
  @ApiParam({ name: 'id', description: 'Feedback ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the feedback with the specified ID',
    type: Feedback,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Feedback not found',
  })
  findOne(@Param('id') id: string) {
    return this.feedbackService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific feedback by ID' })
  @ApiParam({ name: 'id', description: 'Feedback ID', type: String })
  @ApiBody({ type: UpdateFeedbackDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Feedback has been successfully updated.',
    type: Feedback,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Feedback not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  update(@Param('id') id: string, @Body() updateFeedbackDto: UpdateFeedbackDto) {
    return this.feedbackService.update(id, updateFeedbackDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific feedback by ID' })
  @ApiParam({ name: 'id', description: 'Feedback ID', type: String })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Feedback has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Feedback not found',
  })
  remove(@Param('id') id: string) {
    return this.feedbackService.remove(id);
  }
}
