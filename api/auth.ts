import { env } from '../config/env';
import { apiRequest, ApiError } from './httpClient';

const AUTH_API_PREFIX = '/auth/v1';

export interface SignupResponseData {
  id: string;
  username: string;
  createdAt: string;
}

export { ApiError };

function authUrl(path: string): string {
  return `${env.apiHost}${AUTH_API_PREFIX}${path}`;
}

export async function login(loginId: string, password: string): Promise<void> {
  await apiRequest(authUrl('/login'), {
    method: 'POST',
    json: { loginId, password },
  });
}

export async function sendEmailVerification(email: string): Promise<void> {
  await apiRequest(authUrl('/signup/email/verify'), {
    method: 'POST',
    json: { email },
  });
}

export async function verifyEmailCode(email: string, token: string): Promise<void> {
  const params = new URLSearchParams({ email, token });
  await apiRequest(authUrl(`/signup/email/verify?${params.toString()}`), {
    method: 'GET',
  });
}

export async function signup(
  email: string,
  nickname: string,
  password: string,
): Promise<SignupResponseData> {
  return apiRequest<SignupResponseData>(authUrl('/signup'), {
    method: 'POST',
    json: { email, nickname, password },
  });
}
