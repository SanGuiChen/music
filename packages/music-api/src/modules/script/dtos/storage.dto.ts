import { IsNumber, IsString } from 'class-validator';

export class StorageDto {
  @IsNumber()
  songId: number;

  @IsString()
  songName: string;

  @IsString()
  artistId: string;

  @IsString()
  artistName: string;

  @IsNumber()
  albumId: number;

  @IsString()
  albumName: string;

  @IsString()
  imgUrl: string;

  @IsString()
  playUrl: string;
}
