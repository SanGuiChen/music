import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { FavoriteSourceEnum } from 'processors/database/entities/favorite.entity';

export class CreateFavoriteDto {
  @IsString()
  @IsNotEmpty({ message: 'userId is empty' })
  userId: string;

  @IsString({ message: 'songId must be string' })
  @IsNotEmpty({ message: 'songId is empty' })
  songId: string;

  @IsEnum(FavoriteSourceEnum)
  @IsNotEmpty({ message: 'source is empty' })
  source: FavoriteSourceEnum;

  @IsString()
  @IsOptional()
  extra?: string;
}
