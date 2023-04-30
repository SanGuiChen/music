import {
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ReviewStatusEnum } from 'processors/database/entities/review.entity';

export class SearchReviewDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  reviewerId?: string;

  @IsString()
  @IsOptional()
  employeeId?: string;

  @IsString()
  @IsOptional()
  taskId?: string;

  @IsArray()
  @ArrayUnique()
  @IsOptional()
  status?: ReviewStatusEnum[];

  @IsString()
  @IsOptional()
  createTime?: string;

  @IsNumber()
  @IsNotEmpty({ message: 'offset is empty' })
  offset: number;

  @IsNumber()
  @IsNotEmpty({ message: 'limit is empty' })
  limit: number;
}
