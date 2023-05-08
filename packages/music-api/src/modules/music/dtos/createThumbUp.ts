import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateThumbUpDto {
  @IsString({ message: 'userId must be string' })
  @IsNotEmpty({ message: 'userId is empty' })
  userId: string;

  @IsNumber()
  @IsNotEmpty({ message: 'commentId is empty' })
  commentId: number;

  @IsString({ message: 'songId must be string' })
  @IsNotEmpty({ message: 'songId is empty' })
  songId: string;

  @IsString()
  @IsOptional()
  extra?: string;
}
