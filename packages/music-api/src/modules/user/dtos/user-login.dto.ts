import { IsEmail, Length } from 'class-validator';

export class UserLoginDto {
  @IsEmail()
  readonly email: string;

  @Length(8, 16)
  readonly password: string;
}
