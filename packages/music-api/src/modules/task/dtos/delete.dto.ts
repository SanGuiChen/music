import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'taskId is empty' })
  id: string;
}
