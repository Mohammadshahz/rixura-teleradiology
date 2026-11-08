import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('health')
@Controller('/')
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('/health')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Health check',
    description: 'Check the health of the service.',
  })
  healthCheck(): object {
    return { status: 'healthy' };
  }

  @Get()
  @ApiOperation({
    summary: 'Get all examples',
    description: 'Retrieve all example items.',
  })
  getHello(): {} {
    return this.appService.getHello();
  }
}
