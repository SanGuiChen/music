import { IsEmail, IsOptional, Length } from 'class-validator';
import { UserStatusEnum } from 'processors/database/entities/user.entity';

export class UserUpdateDto {
  @IsEmail({
    message: 'UserName must be in email format',
  })
  readonly email: string;

  @IsOptional()
  readonly nickName: string;

  @IsOptional()
  readonly avatar?: string;

  @IsOptional()
  @Length(8, 16, {
    message: 'Password must be between 8 to 16',
  })
  readonly passWord: string;

  @IsOptional()
  readonly status: UserStatusEnum;
}
