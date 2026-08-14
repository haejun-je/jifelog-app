import { env } from '../config/env';
import { CreateDiaryRequest, CreateDiaryResponse } from '../types';
import { apiRequest, ApiError } from './httpClient';

const DIARY_API_PREFIX = '/platform/api/v1/diaries';

function diaryUrl(path: string): string {
  return `${env.apiHost}${DIARY_API_PREFIX}${path}`;
}

/**
 * 일기 작성
 * POST {apiHost}/platform/api/v1/diaries
 *
 * 브라우저 쿠키 세션(`credentials: 'include'`)을 사용하므로
 * 별도의 JWT 헤더는 전달하지 않는다.
 * OpenAPI `createDiary` 스펙을 따른다.
 */
export async function createDiary(payload: CreateDiaryRequest): Promise<CreateDiaryResponse> {
  return apiRequest<CreateDiaryResponse>(diaryUrl(''), {
    method: 'POST',
    json: payload,
  });
}

/**
 * 일기 삭제
 * DELETE {apiHost}/platform/api/v1/diaries/{id}
 */
export async function deleteDiary(id: string): Promise<void> {
  await apiRequest(diaryUrl(`/${id}`), {
    method: 'DELETE',
  });
}

export { ApiError };