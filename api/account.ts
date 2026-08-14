import { env } from '../config/env';
import { apiRequest, ApiError } from './httpClient';

const ACCOUNT_API_PREFIX = '/platform/api/v1/accounts';

export interface AccountMeResponse {
  id: string;
  nickname: string;
  username: string;
  profileImg: string;
}

export { ApiError };

function accountUrl(path: string): string {
  return `${env.apiHost}${ACCOUNT_API_PREFIX}${path}`;
}

/**
 * 현재 로그인된 사용자 계정 정보 조회 (세션 유효성 검증)
 * GET {apiHost}/platform/api/v1/accounts/me
 *
 * 브라우저 쿠키 세션(`credentials: 'include'`)을 사용하므로
 * 별도의 토큰 헤더 없이 호출한다.
 */
export interface GetMyAccountOptions {
  signal?: AbortSignal;
}

export async function getMyAccount(options: GetMyAccountOptions = {}): Promise<AccountMeResponse> {
  return apiRequest<AccountMeResponse>(accountUrl('/me'), {
    method: 'GET',
    signal: options.signal,
  });
}
