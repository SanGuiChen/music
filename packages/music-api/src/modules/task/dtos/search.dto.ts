import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  TaskStatusEnum,
  TaskTypeEnum,
} from 'processors/database/entities/task.entity';

export class SearchDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  id?: string;

  @IsArray()
  @ArrayUnique()
  @IsOptional()
  type?: TaskTypeEnum[];

  @IsArray()
  @ArrayUnique()
  @IsOptional()
  status?: TaskStatusEnum[];

  @IsNumber()
  @IsOptional()
  timeLimit?: number;

  @IsNumber()
  @IsOptional()
  reward?: number;

  @IsString()
  @IsOptional()
  createTime?: string;

  @IsNumber()
  @IsOptional()
  offset: number;

  @IsNumber()
  @IsNotEmpty({ message: 'limit is empty' })
  limit: number;
}
