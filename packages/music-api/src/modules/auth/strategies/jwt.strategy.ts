import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interface';
import { UserService } from 'modules/user/user.service';
import { HttpUnauthorizedError } from 'errors/unauthorized.error';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('TOKEN_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const { id, email } = payload;
    const existUser = await this.userService.findOne({
      id,
      email,
    });
    if (!existUser) {
      throw new HttpUnauthorizedError('登陆态已过期');
    }
    return existUser;
  }
}
