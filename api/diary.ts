import { env } from '../config/env';
import {
  CreateDiaryRequest,
  CreateDiaryResponse,
  CreatePhotoUploadUrlRequest,
  CreatePhotoUploadUrlResponse,
  PresignedFormData,
} from '../types';
import { apiRequest, ApiError, parseErrorResponse } from './httpClient';

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
 * 일기 사진 업로드용 사전서명 URL 발급
 * POST {apiHost}/platform/api/v1/diaries/photos/upload-urls
 *
 * 응답의 form_data 필드명은 MinIO 정책 사양에 따라 그대로 보존되어야 하므로
 * (예: `x-amz-algorithm`, `policy`, `key`) 응답의 snake_case → camelCase 자동 변환에
 * 의존하지 않고 raw 응답을 직접 파싱한다.
 */
export async function createPhotoUploadUrl(
  payload: CreatePhotoUploadUrlRequest,
): Promise<CreatePhotoUploadUrlResponse> {
  const res = await fetch(diaryUrl('/photos/upload-urls'), {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw await parseErrorResponse(res);
  }

  const raw = (await res.json()) as {
    upload_url: string;
    expires_at: string;
    form_data: PresignedFormData;
    max_file_size_bytes: number;
  };
  return {
    uploadUrl: raw.upload_url,
    expiresAt: raw.expires_at,
    formData: raw.form_data,
    maxFileSizeBytes: raw.max_file_size_bytes,
  };
}

/**
 * MinIO 사전서명 URL로 사진 업로드
 * POST {uploadUrl}
 *
 * 응답의 `form_data` 모든 필드를 multipart/form-data 파트에 넣고,
 * 마지막에 실제 파일을 `file` 필드로 추가한다.
 * 업로드 대상은 사전서명된 S3 호환 스토리지이므로 인증 쿠키는 포함하지 않는다.
 */
export async function uploadPhotoToMinio(
  uploadUrl: string,
  formData: PresignedFormData,
  file: File,
): Promise<void> {
  const body = new FormData();
  // 사전서명 정책 사양: 키 순서가 의미 있을 수 있으므로 명세된 순서대로 append.
  body.append('key', formData.key);
  body.append('policy', formData.policy);
  body.append('x-amz-algorithm', formData['x-amz-algorithm']);
  body.append('x-amz-credential', formData['x-amz-credential']);
  body.append('x-amz-date', formData['x-amz-date']);
  body.append('x-amz-signature', formData['x-amz-signature']);
  body.append('file', file, file.name);

  const res = await fetch(uploadUrl, {
    method: 'POST',
    body,
  });

  if (!res.ok) {
    throw new ApiError('UPLOAD_FAILED', '사진 업로드에 실패했습니다.', res.status);
  }
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