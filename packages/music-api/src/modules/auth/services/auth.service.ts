import { User } from '../../../processors/database/entities/user.entity';
import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { UserLoginDto } from 'modules/user/dtos/user-login.dto';
import { JwtService } from '@nestjs/jwt';
import { compareMD5 } from 'transformers/codec.transformer';
import { UserService } from 'modules/user/user.service';
import { UserRegisterDto } from 'modules/user/dtos/user-register.dto';
import { HttpBadRequestError } from 'errors/bad-request.error';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async loginUser({ email, password }: UserLoginDto) {
    const user = await this.userService.findOne({ email });

    if (user && compareMD5(password, user.password)) {
      const token = await this.createToken(user);
      return {
        ...user,
        token,
      };
    }
    throw new HttpBadRequestError('The userName or password is incorrect');
  }

  async createToken(user: User) {
    const payload = { username: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }

  async registerUser(params: UserRegisterDto) {
    const { email } = params;
    const existedUser = await this.userService.findOne({ email });
    if (existedUser) {
      throw new HttpBadRequestError('The user already exists');
    }
    const user = await this.userService.createUser(params);
    return user;
  }
}
