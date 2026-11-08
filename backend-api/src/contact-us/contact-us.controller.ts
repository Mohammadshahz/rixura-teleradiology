import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus } from '@nestjs/common';
import { ContactUsService } from './contact-us.service';
import { CreateContactUsDto } from './dto/create-contact-us.dto';
import { UpdateContactUsDto } from './dto/update-contact-us.dto';
import { FilterContactUsDto } from './dto/filter-contact-us.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery, ApiParam } from '@nestjs/swagger';
import { ContactUs } from './entities/contact-us.entity';

@ApiTags('contact-us')
@Controller('contact-us')
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new contact request' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Contact request created successfully', type: ContactUs })
  create(@Body() createContactUsDto: CreateContactUsDto) {
    return this.contactUsService.create(createContactUsDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all contact requests with optional filtering' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of contact requests', type: [ContactUs] })
  findAll(@Query() filterDto: FilterContactUsDto) {
    return this.contactUsService.findAll(filterDto);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get count of unread contact requests' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Count of unread contact requests', type: Number })
  countUnread() {
    return this.contactUsService.countUnread();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a contact request by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Contact request found', type: ContactUs })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Contact request not found' })
  @ApiParam({ name: 'id', description: 'Contact request ID' })
  findOne(@Param('id') id: string) {
    return this.contactUsService.findOne(id);
  }

  @Patch(':id/mark-as-read')
  @ApiOperation({ summary: 'Mark a contact request as read' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Contact request marked as read', type: ContactUs })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Contact request not found' })
  @ApiParam({ name: 'id', description: 'Contact request ID' })
  markAsRead(@Param('id') id: string) {
    return this.contactUsService.markAsRead(id);
  }

  @Patch(':id/mark-as-unread')
  @ApiOperation({ summary: 'Mark a contact request as unread' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Contact request marked as unread', type: ContactUs })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Contact request not found' })
  @ApiParam({ name: 'id', description: 'Contact request ID' })
  markAsUnread(@Param('id') id: string) {
    return this.contactUsService.markAsUnread(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a contact request' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Contact request updated', type: ContactUs })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Contact request not found' })
  @ApiParam({ name: 'id', description: 'Contact request ID' })
  update(@Param('id') id: string, @Body() updateContactUsDto: UpdateContactUsDto) {
    return this.contactUsService.update(id, updateContactUsDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a contact request' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Contact request deleted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Contact request not found' })
  @ApiParam({ name: 'id', description: 'Contact request ID' })
  remove(@Param('id') id: string) {
    return this.contactUsService.remove(id);
  }
}
