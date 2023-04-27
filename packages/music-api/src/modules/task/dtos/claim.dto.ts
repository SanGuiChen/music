import { IsNotEmpty, IsString } from 'class-validator';

export class ClaimDto {
  @IsString()
  @IsNotEmpty({ message: 'taskId is empty' })
  taskId: string;

  @IsString()
  @IsNotEmpty({ message: 'userId is empty' })
  userId: string;
}
