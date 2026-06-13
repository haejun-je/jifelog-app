import { useState } from 'react';
import { DiaryFormState, EmotionKey, WeatherKey, formStateToCreateRequest } from '../types';
import { createDiary } from '../api/diary';
import { updateDiary as updateDiaryMock } from '../api/diaryMock';
import { ApiError } from '../api/auth';

interface UseDiaryFormOptions {
  initialValues?: Partial<DiaryFormState>;
  onCreateSuccess?: (id: string) => void;
  onUpdateSuccess?: (id: string) => void;
}

export function useDiaryForm({ initialValues, onCreateSuccess, onUpdateSuccess }: UseDiaryFormOptions = {}) {
  const today = new Date().toISOString().slice(0, 10);

  const [date, setDate] = useState(initialValues?.date ?? today);
  const [emotion, setEmotion] = useState<string | null>(initialValues?.emotion ?? null);
  const [weather, setWeather] = useState<string | null>(initialValues?.weather ?? null);
  const [content, setContent] = useState(initialValues?.content ?? '');
  const [energy, setEnergy] = useState<number | null>(initialValues?.energy ?? 3);
  const [satisfaction, setSatisfaction] = useState<number | null>(initialValues?.satisfaction ?? 3);
  const [keywords, setKeywords] = useState<string[]>(initialValues?.keywords ?? []);
  const [achievement, setAchievement] = useState<string[]>(initialValues?.achievement ?? []);
  const [regret, setRegret] = useState<string[]>(initialValues?.regret ?? []);
  const [images, setImages] = useState<string[]>(initialValues?.images ?? []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const canSubmit =
    !isSubmitting &&
    (!!emotion || !!weather || content.trim().length > 0 || energy !== null || satisfaction !== null || keywords.length > 0);

  function initForm(values: DiaryFormState) {
    setDate(values.date);
    setEmotion(values.emotion);
    setWeather(values.weather);
    setContent(values.content);
    setEnergy(values.energy);
    setSatisfaction(values.satisfaction);
    setKeywords(values.keywords);
    setAchievement(values.achievement);
    setRegret(values.regret);
    setImages(values.images);
  }

  async function handleCreate() {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const formState: DiaryFormState = {
        date,
        emotion: emotion as EmotionKey | null,
        weather: weather as WeatherKey | null,
        content,
        energy,
        satisfaction,
        keywords,
        achievement,
        regret,
        images,
      };
      const request = formStateToCreateRequest(formState);
      const response = await createDiary(request);
      onCreateSuccess?.(response.id);
    } catch (e: unknown) {
      if (e instanceof ApiError) {
        // 409: 같은 날짜에 이미 일기가 존재
        if (e.errorCode === 'EC_02_001') {
          setSubmitError('이미 작성된 일기가 존재합니다.');
        } else {
          setSubmitError(e.message);
        }
      } else {
        const err = e as Error;
        setSubmitError(err.message ?? '저장에 실패했습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdate(id: string) {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const formState: DiaryFormState = {
        date,
        emotion: emotion as EmotionKey | null,
        weather: weather as WeatherKey | null,
        content,
        energy,
        satisfaction,
        keywords,
        achievement,
        regret,
        images,
      };
      await updateDiaryMock(id, {
        date: formState.date,
        emotion: formState.emotion,
        weather: formState.weather,
        content: formState.content,
        energy: formState.energy,
        satisfaction: formState.satisfaction,
        keywords: formState.keywords,
        achievement: formState.achievement,
        regret: formState.regret,
        images: formState.images,
      });
      onUpdateSuccess?.(id);
    } catch (e: unknown) {
      if (e instanceof ApiError) {
        setSubmitError(e.message);
      } else {
        const err = e as Error;
        setSubmitError(err.message ?? '수정에 실패했습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    date, setDate,
    emotion, setEmotion,
    weather, setWeather,
    content, setContent,
    energy, setEnergy,
    satisfaction, setSatisfaction,
    keywords, setKeywords,
    achievement, setAchievement,
    regret, setRegret,
    images, setImages,
    isSubmitting,
    submitError,
    canSubmit,
    initForm,
    handleCreate,
    handleUpdate,
  };
}