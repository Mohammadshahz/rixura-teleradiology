import { Controller, Get, Post, Delete, Param, Query, Body, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { UserCenterService } from '../services/user-center.service';
import { UserCenter } from '../entities/user-center.entity';

@ApiTags('User-Center')
@Controller('user-centers')
export class UserCenterController {
  constructor(private readonly userCenterService: UserCenterService) {}

  @Post()
  @ApiOperation({ summary: 'Create a user-center relationship' })
  @ApiQuery({ name: 'userId', description: 'User ID', required: true })
  @ApiQuery({ name: 'centerId', description: 'Center ID', required: true })
  @ApiResponse({ status: 201, description: 'Relationship created successfully', type: UserCenter })
  @ApiResponse({ status: 404, description: 'Center not found' })
  @ApiResponse({ status: 409, description: 'Relationship already exists' })
  async createRelationship(
    @Query('userId') userId: string,
    @Query('centerId') centerId: string,
  ): Promise<UserCenter> {
    return this.userCenterService.createUserCenterRelation(userId, centerId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Find all centers by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Returns array of user-center relationships', type: [UserCenter] })
  async findCentersByUserId(@Param('userId') userId: string): Promise<UserCenter[]> {
    return this.userCenterService.findCentersByUserId(userId);
  }

  @Get('center/:centerId')
  @ApiOperation({ summary: 'Find all users by center ID' })
  @ApiParam({ name: 'centerId', description: 'Center ID' })
  @ApiResponse({ status: 200, description: 'Returns array of user-center relationships', type: [UserCenter] })
  async findUsersByCenterId(@Param('centerId') centerId: string): Promise<UserCenter[]> {
    return this.userCenterService.findUsersByCenterId(centerId);
  }

  @Delete()
  @ApiOperation({ summary: 'Remove a user-center relationship' })
  @ApiQuery({ name: 'userId', description: 'User ID', required: true })
  @ApiQuery({ name: 'centerId', description: 'Center ID', required: true })
  @ApiResponse({ status: 200, description: 'Relationship removed successfully' })
  @ApiResponse({ status: 404, description: 'Relationship not found' })
  async removeRelationship(
    @Query('userId') userId: string,
    @Query('centerId') centerId: string,
  ): Promise<void> {
    return this.userCenterService.removeUserCenterRelation(userId, centerId);
  }
}
