import { env } from '../config/env';
import {
  CreateDiaryRequest,
  CreateDiaryResponse,
  CreatePhotoUploadUrlRequest,
  CreatePhotoUploadUrlResponse,
  DiaryDetail,
  DiaryListItem,
  PresignedFormData,
} from '../types';
import { apiRequest, ApiError, parseErrorResponse } from './httpClient';
import { toSnakeCase } from './caseConverter';

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
 * 일기 목록 조회
 * GET {apiHost}/platform/api/v1/diaries
 */
export async function getDiaries(): Promise<DiaryListItem[]> {
  return apiRequest<DiaryListItem[]>(diaryUrl(''), {
    method: 'GET',
  });
}

/**
 * 일기 상세 조회
 * GET {apiHost}/platform/api/v1/diaries/{id}
 *
 * 응답은 snake_case로 오지만 `apiRequest` 내부에서 camelCase로 자동 변환된다.
 * - 404: ApiError(`EN_02_001`, "존재하지 않는 일기입니다.")
 * - 500: ApiError(`ES_00_001`, "서버 오류가 발생했습니다.")
 */
export async function getDiaryById(id: string): Promise<DiaryDetail> {
  return apiRequest<DiaryDetail>(diaryUrl(`/${id}`), {
    method: 'GET',
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
    body: JSON.stringify(toSnakeCase(payload)),
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
 *
 * form_data 키는 백엔드 응답의 원본 키를 그대로 사용한다 (대소문자·하이픈 보존).
 */
export async function uploadPhotoToMinio(
  uploadUrl: string,
  formData: Record<string, string>,
  file: File,
): Promise<void> {
  const body = new FormData();

  // 백엔드가 준 form_data 키를 그대로 append (대소문자·하이픈 보존)
  for (const [fieldKey, fieldValue] of Object.entries(formData)) {
    body.append(fieldKey, fieldValue);
  }

  // Content-Type 필드 보장 (백엔드 응답에 없을 수 있으므로)
  if (!body.has('Content-Type') && !body.has('content-type')) {
    body.append('Content-Type', file.type || 'application/octet-stream');
  }

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