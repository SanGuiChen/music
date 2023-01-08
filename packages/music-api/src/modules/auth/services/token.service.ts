import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserStatusEnum } from 'processors/database/entities/user.entity';
import { HttpUnauthorizedError } from 'errors/unauthorized.error';
import { Repository } from 'typeorm';
import {
  JwtPayload,
  TokenDto,
  TokenError,
  TokenType,
  ValidateTokenResponseDto,
} from '../interface';
import { UserService } from 'modules/user/user.service';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  /**
   * Generate Auth token(JWT) service for login user
   * @param JwtPayload {JwtPayload}
   * @returns TokenDto Returns access and refresh tokens with expiry
   */
  public generateAuthToken(payload: JwtPayload): TokenDto {
    const accessTokenExpires = this.configService.get(
      'ACCESS_TOKEN_EXPIRES_IN',
    );
    const refreshTokenExpires = this.configService.get(
      'REFRESH_TOKEN_EXPIRES_IN',
    );
    const tokenType = this.configService.get('TOKEN_TYPE');
    const accessToken = this.generateToken(payload, accessTokenExpires);
    const refreshToken = this.generateToken(payload, refreshTokenExpires);

    return {
      tokenType,
      accessToken,
      accessTokenExpires,
      refreshToken,
    };
  }

  /**
   * Generate Refresh token(JWT) service for generating new refresh and access tokens
   * @param payload {JwtPayload}
   * @returns  Returns access and refresh tokens with expiry or error
   */
  public generateRefreshToken(refreshToken: string): TokenDto {
    const { id, userName } = this.verifyToken(
      refreshToken,
      TokenType.RefreshToken,
    );
    return this.generateAuthToken({ id, userName });
  }

  /**
   * Verify JWT service
   * @param token JWT token
   * @param type {TokenType} "refresh" or "access"
   * @returns decrypted payload from JWT
   */
  public verifyToken(token: string, type: TokenType) {
    try {
      return this.jwtService.verify(token);
    } catch ({ name }) {
      if (
        name == TokenError.TokenExpiredError &&
        type == TokenType.AccessToken
      ) {
        throw new HttpUnauthorizedError('Access token has expired');
      }
      if (
        name == TokenError.TokenExpiredError &&
        type == TokenType.RefreshToken
      ) {
        throw new HttpUnauthorizedError('Refresh token has expired');
      }
      throw new HttpUnauthorizedError();
    }
  }

  /**
   * Validate received JWT
   * @param token {string}
   * @returns valid: boolean
   */
  public async validateToken(token: string): Promise<ValidateTokenResponseDto> {
    try {
      const { id } = this.jwtService.verify(token);
      const user = await this.userService.findOne({ id });
      if (!user || user.status === UserStatusEnum.BANNED) {
        return { valid: false };
      }

      return { valid: !!id };
    } catch (error) {
      Logger.error('Validation token error', error);
      return { valid: false };
    }
  }

  /**
   * Generate JWT token
   * @private
   * @param payload {JwtPayload}
   * @returns JWT
   */
  private generateToken(payload: JwtPayload, expiresIn: string): string {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
