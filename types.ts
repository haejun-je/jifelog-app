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
export type EmotionKey = 'happy' | 'sad' | 'angry' | 'neutral' | 'excited' | 'anxious' | 'tired';
export type WeatherKey = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'hail' | 'windy';

export interface Diary {
  id: string;
  date: string;           // YYYY-MM-DD
  emotion: EmotionKey | null;
  weather: WeatherKey | null;
  content: string;
  energy: number | null;  // 1~5
  satisfaction: number | null;  // 1~5
  keywords: string[];
  goodThings: string[];
  badThings: string[];
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
  goodThings: string[];
  badThings: string[];
}

export interface DiaryCreateRequest {
  date: string;
  emotion: EmotionKey | null;
  weather: WeatherKey | null;
  content: string;
  energy: number | null;
  satisfaction: number | null;
  keywords: string[];
  goodThings: string[];
  badThings: string[];
}

export interface DiaryUpdateRequest {
  date?: string;
  emotion?: EmotionKey | null;
  weather?: WeatherKey | null;
  content?: string;
  energy?: number | null;
  satisfaction?: number | null;
  keywords?: string[];
  goodThings?: string[];
  badThings?: string[];
}
