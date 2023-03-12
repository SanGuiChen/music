import { User } from '../../../processors/database/entities/user.entity';
import { Injectable } from '@nestjs/common';
import _, { omit } from 'lodash';
import { UserLoginDto } from 'modules/user/dtos/user-login.dto';
import { JwtService } from '@nestjs/jwt';
import { compareMD5 } from 'transformers/codec.transformer';
import { UserService } from 'modules/user/user.service';
import { UserRegisterDto } from 'modules/user/dtos/user-register.dto';
import { HttpBadRequestError } from 'errors/bad-request.error';
import { JwtPayload } from '../interface';
import { UserUpdateDto } from 'modules/user/dtos/user-update.dto';

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
    const payload: JwtPayload = { email: user.email, id: user.id };
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

  async updateUserInfo(params: UserUpdateDto) {
    if (params?.email) {
      const existUser = await this.userService.findOne({ email: params.email });
      if (existUser) {
        throw new HttpBadRequestError('The email already exists');
      }
    }

    return this.userService.updateUser(params);
  }
}
