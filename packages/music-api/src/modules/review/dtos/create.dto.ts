import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty({ message: 'reviewerId is empty' })
  reviewerId: string;

  @IsString()
  @IsNotEmpty({ message: 'employeeId is empty' })
  employeeId: string;

  @IsString()
  @IsNotEmpty({ message: 'taskId is empty' })
  taskId: string;

  @IsString()
  @IsOptional()
  lyric?: string;

  @IsString()
  @IsOptional()
  playUrl?: string;

  @IsString()
  @IsOptional()
  extra?: string;
}
