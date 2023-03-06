import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

class SongDto {
  @IsString()
  @IsOptional()
  readonly songId?: string;

  @IsString()
  @IsOptional()
  readonly songName?: string;

  @IsString()
  @IsOptional()
  readonly albumId?: string;

  @IsString()
  @IsOptional()
  readonly albumName?: string;

  @IsString()
  @IsOptional()
  readonly artistId?: string;

  @IsString()
  @IsOptional()
  readonly artistName?: string;
}

export class SearchDto {
  @IsOptional()
  @IsArray()
  objects: SongDto[];

  @IsNumber()
  @IsNotEmpty({ message: 'offest is empty' })
  offset: number;

  @IsNumber()
  @IsNotEmpty({ message: 'limit is empty' })
  limit: number;
}
