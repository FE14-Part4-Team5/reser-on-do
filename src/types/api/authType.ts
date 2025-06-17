import type { TokenPair, UserSummary } from './sharedType';

/*POST login, 로그인*/
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse extends TokenPair {
  user: UserSummary;
}

/*POST tokens, 토큰 재발급*/
export type TokenResponse = TokenPair;
