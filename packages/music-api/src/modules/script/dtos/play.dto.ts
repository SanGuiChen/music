import { IsArray, IsNotEmpty } from 'class-validator';

export class PlayDto {
  @IsArray()
  @IsNotEmpty()
  readonly songIds: string[];
}
