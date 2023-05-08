import { IsNotEmpty, IsString } from 'class-validator';

export class SearchThumbUpDto {
  @IsString()
  @IsNotEmpty({ message: 'userId is empty' })
  userId: string;

  @IsString({ message: 'songId must be string' })
  @IsNotEmpty({ message: 'songId is empty' })
  songId: string;
}
