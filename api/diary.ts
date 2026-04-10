import { env } from '../config/env';
import { Diary, DiaryCreateRequest, DiaryUpdateRequest } from '../types';

async function fetchDiary(path: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(`${env.apiHost}/diary${path}`, {
    credentials: 'include',
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = (body as any)?.data?.message ?? (body as any)?.message ?? '요청에 실패했습니다.';
    throw new Error(message);
  }
  return res;
}

export async function getDiaries(): Promise<Diary[]> {
  const res = await fetchDiary('', { method: 'GET' });
  const body: { data: Diary[] } = await res.json();
  return body.data;
}

export async function createDiary(payload: DiaryCreateRequest): Promise<Diary> {
  const res = await fetchDiary('', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body: { data: Diary } = await res.json();
  return body.data;
}

export async function getDiaryById(id: string): Promise<Diary> {
  const res = await fetchDiary(`/${id}`, { method: 'GET' });
  const body: { data: Diary } = await res.json();
  return body.data;
}

export async function updateDiary(id: string, payload: DiaryUpdateRequest): Promise<Diary> {
  const res = await fetchDiary(`/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body: { data: Diary } = await res.json();
  return body.data;
}

export async function deleteDiary(id: string): Promise<void> {
  await fetchDiary(`/${id}`, { method: 'DELETE' });
}
