import { IsNotEmpty, IsString } from 'class-validator';

export class SubmitReviewDto {
  @IsString()
  @IsNotEmpty({ message: 'id is empty' })
  id: string;
}
