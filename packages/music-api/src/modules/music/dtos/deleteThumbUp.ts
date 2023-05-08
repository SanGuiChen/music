import { IsNumber, IsOptional, IsString } from 'class-validator';

export class DeleteThumbUpDto {
  @IsString({ message: 'id must be string' })
  @IsOptional({ message: 'id must be no empty' })
  id?: string;

  @IsNumber()
  @IsOptional()
  commentId?: number;

  @IsString({ message: 'userId must be string' })
  @IsOptional()
  userId?: string;
}
