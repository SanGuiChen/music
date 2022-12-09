import { User } from '../../entities/user.entity';
import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { LoginUserDto } from 'modules/auth/dtos/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compareMD5 } from 'transformers/codec.transformer';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async validateUser({ userName, passWord }: LoginUserDto) {
    const user = await this.userRepo.findOne({ where: { email: userName } });

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
}
