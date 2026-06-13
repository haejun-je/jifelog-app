import { env } from '../config/env';
import { CreateDiaryRequest, CreateDiaryResponse } from '../types';
import { apiRequest, ApiError } from './httpClient';

const DIARY_API_PREFIX = '/v1/diaries';

function diaryUrl(path: string): string {
  return `${env.apiHost}${DIARY_API_PREFIX}${path}`;
}

/**
 * 일기 작성
 * POST /v1/diaries
 */
export async function createDiary(payload: CreateDiaryRequest): Promise<CreateDiaryResponse> {
  return apiRequest<CreateDiaryResponse>(diaryUrl(''), {
    method: 'POST',
    json: payload,
  });
}

/**
 * 일기 삭제
 * DELETE /v1/diaries/{id}
 */
export async function deleteDiary(id: string): Promise<void> {
  await apiRequest(diaryUrl(`/${id}`), {
    method: 'DELETE',
  });
}

export { ApiError };