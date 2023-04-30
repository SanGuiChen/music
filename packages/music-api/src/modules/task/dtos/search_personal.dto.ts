import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class SearchPersonalTaskDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  taskId?: string;

  @IsNumber()
  @IsNotEmpty({ message: 'offset is empty' })
  offset: number;

  @IsNumber()
  @IsNotEmpty({ message: 'limit is empty' })
  limit: number;
}
