import { Diary, DiaryCreateRequest, DiaryUpdateRequest, EmotionKey, WeatherKey } from '../types';

// 인메모리 목업 저장소
let mockDiaries: Diary[] = [
  {
    id: '1',
    date: '2026-04-04',
    emotion: 'happy' as EmotionKey,
    weather: 'sunny' as WeatherKey,
    content: '오늘은 정말 좋은 하루였다. 오랜만에 친구들을 만나서 카페에서 오래 이야기했다. 봄바람이 살랑살랑 불어서 기분도 더 좋았던 것 같다.',
    satisfaction: 5,
    keywords: ['친구', '카페', '휴식'],
    goodThings: ['오랜 친구와 시간을 보냄', '산책 30분'],
    badThings: ['저녁을 너무 많이 먹음'],
    createdAt: '2026-04-04T10:00:00Z',
    updatedAt: '2026-04-04T10:00:00Z',
  },
  {
    id: '2',
    date: '2026-04-03',
    emotion: 'tired' as EmotionKey,
    weather: 'cloudy' as WeatherKey,
    content: '야근이 길어졌다. 피곤하지만 그래도 프로젝트가 잘 마무리돼서 뿌듯하다.',
    satisfaction: 3,
    keywords: ['회의', '야근'],
    goodThings: ['프로젝트 마감 성공'],
    badThings: ['수면 부족', '운동 못함'],
    createdAt: '2026-04-03T22:30:00Z',
    updatedAt: '2026-04-03T22:30:00Z',
  },
  {
    id: '3',
    date: '2026-04-01',
    emotion: 'excited' as EmotionKey,
    weather: 'sunny' as WeatherKey,
    content: '새로운 프로젝트가 시작됐다! 팀원들과 킥오프 미팅을 했는데 분위기가 정말 좋았다. 잘 될 것 같은 예감.',
    satisfaction: 4,
    keywords: ['회의', '공부'],
    goodThings: ['팀원들과 좋은 출발'],
    badThings: [],
    createdAt: '2026-04-01T14:00:00Z',
    updatedAt: '2026-04-01T14:00:00Z',
  },
  {
    id: '4',
    date: '2026-03-30',
    emotion: 'sad' as EmotionKey,
    weather: 'rainy' as WeatherKey,
    content: '비가 하루 종일 내렸다. 괜히 울적한 기분이 들어서 집에서 영화를 봤다.',
    satisfaction: 2,
    keywords: ['휴식'],
    goodThings: ['영화 두 편 봄'],
    badThings: ['하루 종일 집에만 있음', '생산성 제로'],
    createdAt: '2026-03-30T18:00:00Z',
    updatedAt: '2026-03-30T18:00:00Z',
  },
  {
    id: '5',
    date: '2026-03-28',
    emotion: 'neutral' as EmotionKey,
    weather: 'windy' as WeatherKey,
    content: '',
    satisfaction: null,
    keywords: [],
    goodThings: [],
    badThings: [],
    createdAt: '2026-03-28T09:00:00Z',
    updatedAt: '2026-03-28T09:00:00Z',
  },
];

let nextId = 6;

export function getDiaries(): Promise<Diary[]> {
  const sorted = [...mockDiaries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  return Promise.resolve(sorted);
}

export function getDiaryById(id: string): Promise<Diary> {
  const diary = mockDiaries.find((d) => d.id === id);
  if (!diary) return Promise.reject(new Error('일기를 찾을 수 없습니다.'));
  return Promise.resolve({ ...diary });
}

export function createDiary(payload: DiaryCreateRequest): Promise<Diary> {
  const now = new Date().toISOString();
  const newDiary: Diary = {
    id: String(nextId++),
    ...payload,
    createdAt: now,
    updatedAt: now,
  };
  mockDiaries = [newDiary, ...mockDiaries];
  return Promise.resolve({ ...newDiary });
}

export function updateDiary(id: string, payload: DiaryUpdateRequest): Promise<Diary> {
  const index = mockDiaries.findIndex((d) => d.id === id);
  if (index === -1) return Promise.reject(new Error('일기를 찾을 수 없습니다.'));
  const updated: Diary = {
    ...mockDiaries[index],
    ...payload,
    updatedAt: new Date().toISOString(),
  };
  mockDiaries = mockDiaries.map((d) => (d.id === id ? updated : d));
  return Promise.resolve({ ...updated });
}

export function deleteDiary(id: string): Promise<void> {
  mockDiaries = mockDiaries.filter((d) => d.id !== id);
  return Promise.resolve();
}
