import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class SearchDto {
  @IsArray()
  @IsNotEmpty({ message: 'keywords is empty' })
  readonly keyWords: string[];

  @IsNumber()
  @IsNotEmpty({ message: 'offset is empty' })
  readonly offset: number;

  @IsNumber()
  @IsNotEmpty({ message: 'limit is empty' })
  readonly limit: number;
}
