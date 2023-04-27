import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TaskTypeEnum } from 'processors/database/entities/task.entity';

export class CreateDto {
  @IsString({ message: 'name is no string type' })
  @IsNotEmpty({ message: 'name is empty' })
  name: string;

  @IsString({ message: 'creatorId is no string type' })
  @IsNotEmpty({ message: 'creatorId is empty' })
  creatorId: string;

  @IsEnum(TaskTypeEnum, { message: 'type is no enum type' })
  @IsNotEmpty({ message: 'type is empty' })
  type: TaskTypeEnum;

  @IsNumber({}, { message: 'timeLimit is no number type' })
  @IsNotEmpty({ message: 'timeLimit is empty' })
  timeLimit: number;

  @IsNumber({}, { message: 'reward is no number type' })
  @IsNotEmpty({ message: 'reward is empty' })
  reward: number;

  @IsString({ message: 'extra is no string type' })
  @IsOptional()
  extra: string;
}
