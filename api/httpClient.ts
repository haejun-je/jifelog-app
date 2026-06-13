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
  ) {
    super(message);
  }
}

export async function parseErrorResponse(res: Response): Promise<ApiError> {
  try {
    const body = toCamelCase<ApiErrorResponse>(await res.json());
    return new ApiError(body.data.errorCode, body.data.message);
  } catch {
    return new ApiError('UNKNOWN', '요청에 실패했습니다.');
  }
}

export interface ApiRequestInit extends Omit<RequestInit, 'body'> {
  json?: unknown;
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
    throw await parseErrorResponse(res);
  }

  const text = await res.text();
  if (!text) {
    return undefined as TResponse;
  }

  const body = toCamelCase<{ data: TResponse }>(JSON.parse(text));
  return body.data;
}
