import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DiaryFormState, EmotionKey, WeatherKey } from '../types';
import { createDiary, updateDiary } from '../api/diaryMock';

export function useDiaryForm(initialValues?: Partial<DiaryFormState>) {
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);

  const [date, setDate] = useState(initialValues?.date ?? today);
  const [emotion, setEmotion] = useState<string | null>(initialValues?.emotion ?? null);
  const [weather, setWeather] = useState<string | null>(initialValues?.weather ?? null);
  const [content, setContent] = useState(initialValues?.content ?? '');
  const [satisfaction, setSatisfaction] = useState<number | null>(initialValues?.satisfaction ?? null);
  const [keywords, setKeywords] = useState<string[]>(initialValues?.keywords ?? []);
  const [goodThings, setGoodThings] = useState<string[]>(initialValues?.goodThings ?? []);
  const [badThings, setBadThings] = useState<string[]>(initialValues?.badThings ?? []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const canSubmit =
    !isSubmitting &&
    (!!emotion || !!weather || content.trim().length > 0 || satisfaction !== null || keywords.length > 0);

  function initForm(values: DiaryFormState) {
    setDate(values.date);
    setEmotion(values.emotion);
    setWeather(values.weather);
    setContent(values.content);
    setSatisfaction(values.satisfaction);
    setKeywords(values.keywords);
    setGoodThings(values.goodThings);
    setBadThings(values.badThings);
  }

  async function handleCreate() {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await createDiary({
        date,
        emotion: emotion as EmotionKey | null,
        weather: weather as WeatherKey | null,
        content,
        satisfaction,
        keywords,
        goodThings,
        badThings,
      });
      navigate('/diary');
    } catch (e: unknown) {
      const err = e as Error;
      setSubmitError(err.message ?? '저장에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdate(id: string) {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await updateDiary(id, {
        date,
        emotion: emotion as EmotionKey | null,
        weather: weather as WeatherKey | null,
        content,
        satisfaction,
        keywords,
        goodThings,
        badThings,
      });
      navigate(`/diary/${id}`);
    } catch (e: unknown) {
      const err = e as Error;
      setSubmitError(err.message ?? '수정에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    date, setDate,
    emotion, setEmotion,
    weather, setWeather,
    content, setContent,
    satisfaction, setSatisfaction,
    keywords, setKeywords,
    goodThings, setGoodThings,
    badThings, setBadThings,
    isSubmitting,
    submitError,
    canSubmit,
    initForm,
    handleCreate,
    handleUpdate,
  };
}
