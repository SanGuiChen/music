import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class SearchPersonalTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'userId is empty' })
  userId: string;

  @IsNumber()
  @IsNotEmpty({ message: 'offset is empty' })
  offset: number;

  @IsNumber()
  @IsNotEmpty({ message: 'limit is empty' })
  limit: number;
}
