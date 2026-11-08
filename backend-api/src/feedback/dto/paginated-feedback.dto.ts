import { ApiProperty } from '@nestjs/swagger';
import { Feedback } from '../entities/feedback.entity';
import { User } from '../../user/entities/user.entity';

// This represents a feedback with expanded user information
export class FeedbackWithUserDto {
  @ApiProperty({ description: 'Feedback ID' })
  id: string;

  @ApiProperty({ description: 'Feedback description' })
  description: string;

  @ApiProperty({ description: 'ID of the user who provided the feedback' })
  userId: string;

  @ApiProperty({ description: 'User who provided the feedback', type: () => User })
  user: User;

  @ApiProperty({ description: 'Creation date of the feedback' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date of the feedback' })
  updatedAt: Date;
}

export class PaginatedFeedbackDto {
  @ApiProperty({ description: 'List of feedbacks with user information', type: [FeedbackWithUserDto] })
  data: FeedbackWithUserDto[];

  @ApiProperty({ description: 'Total number of feedbacks matching the filters' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;
}
