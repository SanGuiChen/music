import { IsNumber, IsOptional, IsString } from 'class-validator';

export class StorageDto {
  @IsString()
  songId: number | string;

  @IsString({ message: 'songName must be string' })
  songName: string;

  @IsString()
  artistId: number | string;

  @IsString({ message: 'artistName must be string' })
  artistName: string;

  @IsString()
  albumId: number | string;

  @IsString({ message: 'albumName must be string' })
  albumName: string;

  @IsString({ message: 'imgUrl must be string' })
  @IsOptional()
  imgUrl?: string;

  @IsString({ message: 'playUrl must be string' })
  @IsOptional()
  playUrl?: string;

  @IsString({ message: 'lyric must be string' })
  @IsOptional()
  lyric?: string;
}
