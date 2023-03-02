import { IsArray, IsNotEmpty } from 'class-validator';

export class SearchDto {
  @IsArray()
  @IsNotEmpty()
  readonly keyWords: string[];
}
