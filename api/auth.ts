import { env } from '../config/env';

const AUTH_API_PREFIX = '/auth';

export interface ApiErrorData {
  error_code: string;
  message: string;
  details: { field: string; message: string }[] | null;
}

export interface ApiErrorResponse {
  data: ApiErrorData;
}

export interface SignupResponseData {
  id: string;
  username: string;
  created_at: string;
}

export class ApiError extends Error {
  constructor(
    public readonly errorCode: string,
    message: string,
  ) {
    super(message);
  }
}

async function parseErrorResponse(res: Response): Promise<ApiError> {
  try {
    const body: ApiErrorResponse = await res.json();
    return new ApiError(body.data.error_code, body.data.message);
  } catch {
    return new ApiError('UNKNOWN', '요청에 실패했습니다.');
  }
}

function authUrl(path: string): string {
  return `${env.apiHost}${AUTH_API_PREFIX}${path}`;
}

async function fetchAuth(path: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(authUrl(path), {
    credentials: 'include',
    ...init,
  });

  if (!res.ok) {
    throw await parseErrorResponse(res);
  }

  return res;
}

export async function login(email: string, password: string): Promise<void> {
  await fetchAuth('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
}

export async function sendEmailVerification(email: string): Promise<void> {
  await fetchAuth('/signup/email/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
}

export async function verifyEmailCode(email: string, token: string): Promise<void> {
  const params = new URLSearchParams({ email, token });
  await fetchAuth(`/signup/email/verify?${params.toString()}`, {
    method: 'GET',
  });
}

export async function signup(
  email: string,
  username: string,
  password: string,
): Promise<SignupResponseData> {
  const res = await fetchAuth('/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, username, password }),
  });

  const body: { data: SignupResponseData } = await res.json();
  return body.data;
}
