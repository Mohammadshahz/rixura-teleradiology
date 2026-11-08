import { IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class IdParams {
  @ApiProperty({
    example: '865f508c-af52-4a5d-8b73-9412d0ddc9f1',
    description: 'ID of the course this module belongs to',
  })
  @IsNotEmpty()
  @IsUUID()
  id: string;
}

export class UserIdParams {
  @ApiProperty({
    example: '865f508c-af52-4a5d-8b73-9412d0ddc9f1',
    description: 'ID of the course this module belongs to',
    required: false,
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
