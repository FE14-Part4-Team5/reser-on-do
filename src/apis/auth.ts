import axios from 'axios';
import * as AuthType from '@/types/api/authType';
import { AxiosError } from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL || '';

/*로그인*/
const login = async (body: AuthType.LoginRequest): Promise<AuthType.LoginResponse> => {
  try {
    const response = await axios.post<AuthType.LoginResponse>(`${BASE_URL}/auth/login`, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    console.error('로그인 실패:', err);
    throw new Error(err.response?.data?.message || '로그인 중 오류가 발생했습니다.');
  }
};

const tokens = async (refreshToken: string): Promise<AuthType.TokenResponse> => {
  try {
    const response = await axios.post<AuthType.TokenResponse>(
      `${BASE_URL}/auth/tokens`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    console.error('토큰 갱신 실패:', err);
    throw new Error(err.response?.data?.message || '토큰 갱신 중 오류가 발생했습니다.');
  }
};

export const authService = {
  login,
  tokens,
};
