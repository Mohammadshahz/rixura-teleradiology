import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AdminLoginDto {
  @ApiProperty({
    description: 'Username of admin user',
    example: 'admin'
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Password of admin user',
    example: 'password'
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
