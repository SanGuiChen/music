import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class StorageDto {
  @IsNumberString()
  songId: number | string;

  @IsString()
  songName: string;

  @IsNumberString()
  artistId: number | string;

  @IsString()
  artistName: string;

  @IsNumberString()
  albumId: number | string;

  @IsString()
  albumName: string;

  @IsString()
  @IsOptional()
  imgUrl?: string;

  @IsString()
  @IsOptional()
  playUrl?: string;
}
