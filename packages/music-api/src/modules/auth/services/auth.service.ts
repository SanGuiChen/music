import { User } from '../../../processors/database/entities/user.entity';
import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { UserLoginDto } from 'modules/user/dtos/user-login.dto';
import { JwtService } from '@nestjs/jwt';
import { compareMD5 } from 'transformers/codec.transformer';
import { UserService } from 'modules/user/user.service';
import { UserRegisterDto } from 'modules/user/dtos/user-register.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async validateUser({ email, passWord }: UserLoginDto) {
    const user = await this.userService.findOne({ email, passWord });

    if (user && compareMD5(passWord, user.passWord)) {
      return _.omit(user, ['passWord']);
    }
    return null;
  }

  async login(user: User) {
    const payload = { username: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async registerUser(params: UserRegisterDto) {
    const user = await this.userService.createUser(params);
    return user;
  }
}
