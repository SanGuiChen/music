import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { UserLoginDto } from 'modules/user/dtos/user-login.dto';
import { AuthService } from './services/auth.service';
import { UserRegisterDto } from '../user/dtos/user-register.dto';
import { User } from 'processors/database/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async userLogin(
    @Body() loginUserDto: UserLoginDto,
  ): Promise<Omit<User, 'passWord'>> {
    return this.authService.validateUser(loginUserDto);
  }

  @Post('register')
  async userRegister(@Body() registerUserDto: UserRegisterDto) {
    return this.authService.registerUser(registerUserDto);
  }
}
