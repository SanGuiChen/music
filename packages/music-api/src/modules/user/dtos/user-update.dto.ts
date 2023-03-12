import { IsEmail, IsOptional, Length, IsNotEmpty } from 'class-validator';
import { UserStatusEnum } from 'processors/database/entities/user.entity';

export class UserUpdateDto {
  @IsNotEmpty({ message: 'id is not empty' })
  readonly id: string;

  @IsEmail({
    message: 'UserName must be in email format',
  })
  @IsOptional()
  readonly email: string;

  @IsOptional()
  readonly nickname: string;

  @IsOptional()
  readonly avatar?: string;

  @IsOptional()
  @Length(8, 16, {
    message: 'Password must be between 8 to 16',
  })
  readonly password: string;

  @IsOptional()
  readonly status: UserStatusEnum;
}
