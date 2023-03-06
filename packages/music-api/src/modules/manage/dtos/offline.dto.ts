import { IsNotEmpty, IsString } from 'class-validator';

export class OfflineDto {
  @IsString({ message: 'id muse be string' })
  @IsNotEmpty({ message: 'id is required' })
  readonly id: string;
}
