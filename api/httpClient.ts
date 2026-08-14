import { toCamelCase, toSnakeCase } from './caseConverter';

export interface ApiErrorData {
  errorCode: string;
  message: string;
  details: { field: string; message: string }[] | null;
}

export interface ApiErrorResponse {
  data: ApiErrorData;
}

export class ApiError extends Error {
  constructor(
    public readonly errorCode: string,
    message: string,
    public readonly status?: number,
  ) {
    super(message);
  }
}

export async function parseErrorResponse(res: Response): Promise<ApiError> {
  try {
    const raw = await res.json();
    const body = toCamelCase<{ data?: ApiErrorData; errorCode?: string; message?: string }>(raw);
    const errorCode = body?.data?.errorCode ?? body?.errorCode ?? 'UNKNOWN';
    const message = body?.data?.message ?? body?.message ?? '요청에 실패했습니다.';
    return new ApiError(errorCode, message, res.status);
  } catch {
    return new ApiError('UNKNOWN', '요청에 실패했습니다.', res.status);
  }
}

export interface ApiRequestInit extends Omit<RequestInit, 'body'> {
  json?: unknown;
}

/**
 * Lazy validation hook: any API call returning 401 should invalidate the session so the
 * AuthContext can flip to `unauthenticated` and ProtectedRoute redirects to /login.
 *
 * AuthContext registers its callback at mount time. We avoid importing AuthContext here to
 * prevent a circular dependency — httpClient is a leaf module that AuthContext depends on.
 */
export type UnauthorizedHandler = () => void;
let unauthorizedHandler: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
  unauthorizedHandler = handler;
}

export async function apiRequest<TResponse = void>(
  url: string,
  init: ApiRequestInit = {},
): Promise<TResponse> {
  const { json, headers, ...rest } = init;

  const res = await fetch(url, {
    credentials: 'include',
    ...rest,
    headers: json !== undefined ? { 'Content-Type': 'application/json', ...headers } : headers,
    body: json !== undefined ? JSON.stringify(toSnakeCase(json)) : undefined,
  });

  if (!res.ok) {
    if (res.status === 401) {
      unauthorizedHandler?.();
    }
    throw await parseErrorResponse(res);
  }

  const text = await res.text();
  if (!text) {
    return undefined as TResponse;
  }

  const raw = JSON.parse(text);
  const body = toCamelCase<any>(raw);
  if (body && typeof body === 'object' && 'data' in body && body.data !== undefined) {
    return body.data as TResponse;
  }
  return body as TResponse;
}

