import { Smile, Laugh, Meh, Frown, Angry, CircleAlert, Coffee, Sun, Cloud, CloudRain, CloudSnow, CloudHail, Wind } from 'lucide-react';

export const EMOTION_OPTIONS = [
  { key: 'happy',   icon: Smile,       label: '행복' },
  { key: 'excited', icon: Laugh,       label: '신남' },
  { key: 'neutral', icon: Meh,         label: '보통' },
  { key: 'sad',     icon: Frown,       label: '슬픔' },
  { key: 'angry',   icon: Angry,       label: '화남' },
  { key: 'anxious', icon: CircleAlert, label: '불안' },
  { key: 'tired',   icon: Coffee,      label: '피곤' },
] as const;

export const WEATHER_OPTIONS = [
  { key: 'sunny',  icon: Sun,       label: '맑음' },
  { key: 'cloudy', icon: Cloud,     label: '흐림' },
  { key: 'rainy',  icon: CloudRain, label: '비' },
  { key: 'snowy',  icon: CloudSnow, label: '눈' },
  { key: 'hail',   icon: CloudHail, label: '우박' },
  { key: 'windy',  icon: Wind,      label: '태풍' },
] as const;

export type EmotionOption = typeof EMOTION_OPTIONS[number];
export type WeatherOption = typeof WEATHER_OPTIONS[number];
