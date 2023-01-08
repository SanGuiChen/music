export interface TokenDto {
  tokenType: string;
  accessToken: string;
  accessTokenExpires: number;
  refreshToken: string;
}

export interface JwtPayload {
  id: string;
  userName: string;
}

export interface ValidateTokenResponseDto {
  valid: boolean;
}

export enum TokenType {
  RefreshToken = 'REFRESH_TOKEN',
  AccessToken = 'ACCESS_TOKEN',
}

export enum TokenError {
  JsonWebTokenError = 'JsonWebTokenError',
  TokenExpiredError = 'TokenExpiredError',
  SyntaxError = 'SyntaxError',
}
