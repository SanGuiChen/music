import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  readonly userName: string;

  @IsNotEmpty()
  readonly passWord: string;
}
