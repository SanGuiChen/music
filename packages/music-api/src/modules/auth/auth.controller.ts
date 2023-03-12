import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserLoginDto } from 'modules/user/dtos/user-login.dto';
import { AuthService } from './services/auth.service';
import { UserRegisterDto } from '../user/dtos/user-register.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserUpdateDto } from 'modules/user/dtos/user-update.dto';

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

  @UseGuards(AuthGuard('jwt'))
  @Get('getUserInfo')
  async getUserInfo(@Req() req) {
    return req.user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('updateUserInfo')
  async updateUserInfo(@Body() userUpdateDto: UserUpdateDto) {
    return this.authService.updateUserInfo(userUpdateDto);
  }
}
