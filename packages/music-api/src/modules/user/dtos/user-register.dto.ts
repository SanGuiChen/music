import { IsEmail, IsOptional, Length } from 'class-validator';

export class UserRegisterDto {
  @Length(1, 50, {
    message: 'NickName must be between 1 and 50',
  })
  readonly nickName: string;

  @IsOptional()
  readonly avatar?: string;

  @IsEmail()
  readonly email: string;

  @Length(8, 16)
  readonly passWord: string;
}
