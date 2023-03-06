import { IsNotEmpty, IsString } from 'class-validator';

export class ShelvesDto {
  @IsString({ message: 'id muse be string' })
  @IsNotEmpty({ message: 'id is required' })
  readonly id: string;
}
