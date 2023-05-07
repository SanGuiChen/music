import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DeleteFavoriteDto {
  @IsString({ message: 'id must be string' })
  @IsOptional()
  id?: string;

  @IsString({ message: 'songId must be string' })
  @IsOptional()
  songId?: string;

  @IsString({ message: 'userId must be string' })
  @IsOptional()
  userId?: string;
}
