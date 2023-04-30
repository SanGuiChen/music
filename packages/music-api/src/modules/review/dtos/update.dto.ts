import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReviewStatusEnum } from 'processors/database/entities/review.entity';

export class UpdateReviewDto {
  @IsString()
  @IsOptional()
  reviewerId?: string;

  @IsString()
  @IsOptional()
  employeeId?: string;

  @IsString()
  @IsOptional()
  taskId?: string;

  @IsEnum(ReviewStatusEnum)
  @IsOptional()
  status?: ReviewStatusEnum;

  @IsString()
  @IsOptional()
  extra?: string;
}
