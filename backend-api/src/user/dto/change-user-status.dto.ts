import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserStatus } from '../enums/user-status.enum';

/**
 * DTO for changing a user's active/inactive status
 */
export class ChangeUserStatusDto {
  @ApiProperty({
    description: 'User status',
    enum: UserStatus,
    example: UserStatus.ACTIVE
  })
  @IsEnum(UserStatus)
  @IsNotEmpty()
  status: UserStatus;
}
