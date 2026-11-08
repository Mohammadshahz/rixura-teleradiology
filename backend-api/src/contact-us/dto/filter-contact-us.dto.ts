import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { ContactType, RequestType } from '../entities/contact-us.entity';
import { Transform } from 'class-transformer';

export class FilterContactUsDto {
  @ApiProperty({ 
    description: 'Filter by read status', 
    required: false 
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isRead?: boolean;

  @ApiProperty({ 
    description: 'Filter by contact type', 
    enum: ContactType,
    required: false 
  })
  @IsOptional()
  @IsEnum(ContactType)
  contactType?: ContactType;

  @ApiProperty({ 
    description: 'Filter by request type', 
    enum: RequestType,
    required: false 
  })
  @IsOptional()
  @IsEnum(RequestType)
  requestType?: RequestType;

  @ApiProperty({ 
    description: 'Search by fullname or email',
    required: false 
  })
  @IsOptional()
  @IsString()
  search?: string;
}
