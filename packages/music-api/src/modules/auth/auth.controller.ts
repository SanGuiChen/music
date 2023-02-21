import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { UserLoginDto } from 'modules/user/dtos/user-login.dto';
import { AuthService } from './services/auth.service';
import { UserRegisterDto } from '../user/dtos/user-register.dto';
import { User } from 'processors/database/entities/user.entity';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async userLogin(@Body() loginUserDto: UserLoginDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @Post('register')
  async userRegister(@Body() registerUserDto: UserRegisterDto) {
    return this.authService.registerUser(registerUserDto);
  }

  @Post('verify/token')
  async verifyToken(@Body() registerUserDto: UserRegisterDto) {
    return this.authService.registerUser(registerUserDto);
  }
}
