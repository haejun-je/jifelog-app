import React from 'react';

export interface FeedItem {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  image?: string;
  timestamp: string;
  type: 'journal' | 'schedule' | 'memory';
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  // Fix: Import React to resolve React namespace for ReactNode
  icon: React.ReactNode;
  color: string;
}

// 피드 관련 타입
export interface Feed {
  id: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  images: string[];
  hashtags: string[];
  location?: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  isLiked: boolean;
  isBookmarked: boolean;
  comments: Comment[];
}

export interface Comment {
  id: string;
  feedId: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
  replies: Reply[];
}

export interface Reply {
  id: string;
  commentId: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
}

// 일정 관련 타입
export interface Schedule {
  id: string;
  title: string;
  date: string;
  time?: string;
  dDay: number;
}

// 드라이브 파일 관련 타입
export interface DriveFile {
  id: string;
  name: string;
  extension: string;
  updatedAt: string;
}

// 일기 관련 타입

// --- 프론트엔드 UI 모델 ---
export type EmotionKey = 'happy' | 'sad' | 'angry' | 'neutral' | 'excited' | 'anxious' | 'tired';
export type WeatherKey = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'hail' | 'typhoon';

export interface Diary {
  id: string;
  date: string;           // YYYY-MM-DD
  emotion: EmotionKey | null;
  weather: WeatherKey | null;
  content: string;
  energy: number | null;  // 1~5
  satisfaction: number | null;  // 1~5
  keywords: string[];
  achievement: string[];
  regret: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DiaryFormState {
  date: string;
  emotion: EmotionKey | null;
  weather: WeatherKey | null;
  content: string;
  energy: number | null;
  satisfaction: number | null;
  keywords: string[];
  achievement: string[];
  regret: string[];
  images: string[];
}

// --- API 모델 (OpenAPI 스펙 매칭) ---
export type Mood = 'HAPPY' | 'EXCITED' | 'NEUTRAL' | 'SAD' | 'ANGRY' | 'ANXIOUS' | 'TIRED';
export type Weather = 'SUNNY' | 'CLOUDY' | 'RAIN' | 'SNOW' | 'HAIL' | 'TYPHOON';

export interface CreateDiaryRequest {
  entryDate: string;          // YYYY-MM-DD
  mood: Mood;
  weather: Weather;
  energyLevel: number;        // 1~5
  satisfactionLevel: number;  // 1~5
  keywords: string[];
  achievement: string[];
  regret: string[];
  content: string;
  images?: string[];          // 레거시/호환용 (선택)
  objectKeys?: string[];      // 업로드 완료된 이미지 object key 목록
}

export interface CreateDiaryResponse {
  id: string;  // UUID
}

// --- 일기 목록 조회 응답 ---
export interface DiaryListItem {
  id: string;
  date: string;           // YYYY-MM-DD
  mood: Mood;
  weather: Weather;
  satisfaction: number | null;
  keywords: string[];
  content: string;
  imageUrl: string | null;
}

// --- 사진 사전서명 업로드 URL 요청/응답 ---
export interface CreatePhotoUploadUrlRequest {
  fileName: string;
  contentType: string;
  entryDate: string;          // YYYY-MM-DD
}

/**
 * MinIO 사전서명 POST 정책의 form 필드.
 * 백엔드 응답 키(x-amz-*, policy, key 등)는 변환 규칙상 보존되므로 그대로 사용한다.
 */
export interface PresignedFormData {
  key: string;
  policy: string;
  'x-amz-algorithm': string;
  'x-amz-credential': string;
  'x-amz-date': string;
  'x-amz-signature': string;
}

export interface CreatePhotoUploadUrlResponse {
  uploadUrl: string;
  expiresAt: string;
  formData: PresignedFormData;
  maxFileSizeBytes: number;
}

// --- EmotionKey ↔ Mood 변환 ---
const EMOTION_TO_MOOD: Record<EmotionKey, Mood> = {
  happy: 'HAPPY',
  excited: 'EXCITED',
  neutral: 'NEUTRAL',
  sad: 'SAD',
  angry: 'ANGRY',
  anxious: 'ANXIOUS',
  tired: 'TIRED',
};

const MOOD_TO_EMOTION: Record<Mood, EmotionKey> = {
  HAPPY: 'happy',
  EXCITED: 'excited',
  NEUTRAL: 'neutral',
  SAD: 'sad',
  ANGRY: 'angry',
  ANXIOUS: 'anxious',
  TIRED: 'tired',
};

export function toMood(key: EmotionKey): Mood {
  return EMOTION_TO_MOOD[key];
}

export function toEmotionKey(mood: Mood): EmotionKey {
  return MOOD_TO_EMOTION[mood];
}

// --- WeatherKey ↔ Weather 변환 ---
const WEATHER_KEY_TO_API: Record<WeatherKey, Weather> = {
  sunny: 'SUNNY',
  cloudy: 'CLOUDY',
  rainy: 'RAIN',
  snowy: 'SNOW',
  hail: 'HAIL',
  typhoon: 'TYPHOON',
};

const API_TO_WEATHER_KEY: Record<Weather, WeatherKey> = {
  SUNNY: 'sunny',
  CLOUDY: 'cloudy',
  RAIN: 'rainy',
  SNOW: 'snowy',
  HAIL: 'hail',
  TYPHOON: 'typhoon',
};

export function toWeatherEnum(key: WeatherKey): Weather {
  return WEATHER_KEY_TO_API[key];
}

export function toWeatherKey(weather: Weather): WeatherKey {
  return API_TO_WEATHER_KEY[weather];
}

// --- DiaryFormState → CreateDiaryRequest 변환 ---
export function formStateToCreateRequest(form: DiaryFormState): CreateDiaryRequest {
  return {
    entryDate: form.date,
    mood: toMood(form.emotion ?? 'neutral'),
    weather: toWeatherEnum(form.weather ?? 'sunny'),
    energyLevel: form.energy ?? 3,
    satisfactionLevel: form.satisfaction ?? 3,
    keywords: form.keywords,
    achievement: form.achievement,
    regret: form.regret,
    content: form.content,
    images: form.images,
  };
}

export interface DiaryUpdateRequest {
  date?: string;
  emotion?: EmotionKey | null;
  weather?: WeatherKey | null;
  content?: string;
  energy?: number | null;
  satisfaction?: number | null;
  keywords?: string[];
  achievement?: string[];
  regret?: string[];
  images?: string[];
}

// --- 계정 / 사용자 관련 타입 ---
export interface Account {
  id: string;
  nickname: string;
  username: string;
  profileImg: string;
}

