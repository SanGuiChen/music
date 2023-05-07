import { IsNotEmpty, IsString } from 'class-validator';

export class SearchFavoriteDto {
  @IsString()
  @IsNotEmpty({ message: 'userId is empty' })
  userId: string;
}
