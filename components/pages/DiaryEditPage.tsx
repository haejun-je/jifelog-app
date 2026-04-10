import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDiaryForm } from '../../hooks/useDiaryForm';
import { getDiaryById } from '../../api/diaryMock';
import EmotionPicker from '../diary/EmotionPicker';
import WeatherPicker from '../diary/WeatherPicker';
import SatisfactionSlider from '../diary/SatisfactionSlider';
import KeywordPicker from '../diary/KeywordPicker';
import ReflectionInput from '../diary/ReflectionInput';
import UniversalHeader from '../layout/UniversalHeader';

const DiaryEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoadingDiary, setIsLoadingDiary] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const {
    date, setDate,
    emotion, setEmotion,
    weather, setWeather,
    content, setContent,
    satisfaction, setSatisfaction,
    keywords, setKeywords,
    goodThings, setGoodThings,
    badThings, setBadThings,
    isSubmitting, submitError, canSubmit,
    initForm,
    handleUpdate,
  } = useDiaryForm();

  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        const diary = await getDiaryById(id!);
        initForm({
          date: diary.date,
          emotion: diary.emotion,
          weather: diary.weather,
          content: diary.content,
          satisfaction: diary.satisfaction,
          keywords: diary.keywords,
          goodThings: diary.goodThings,
          badThings: diary.badThings,
        });
      } catch (e: unknown) {
        const err = e as Error;
        setLoadError(err.message ?? '일기를 불러오지 못했습니다.');
      } finally {
        setIsLoadingDiary(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] transition-colors flex flex-col">
      <UniversalHeader
        title="일기 수정"
        onBack={() => navigate(`/diary/${id}`)}
        showBack={true}
      />

      <main className="flex-1 overflow-y-auto pb-[calc(4rem+env(safe-area-inset-bottom)+1.5rem)] md:pb-10">
        <div className="max-w-2xl mx-auto px-4 md:px-5 md:py-6">
          {isLoadingDiary && (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!isLoadingDiary && loadError && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/20 p-5 text-center"
            >
              <p className="text-sm text-red-600 dark:text-red-400">{loadError}</p>
            </motion.div>
          )}

          {!isLoadingDiary && !loadError && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* 날짜 */}
              <section className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-5">
                <label className="block text-xs font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-3">
                  날짜
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                />
              </section>

              {/* 1. 감정 */}
              <section className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-5">
                <label className="block text-xs font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-3">
                  오늘의 감정
                </label>
                <EmotionPicker value={emotion} onChange={setEmotion} />
              </section>

              {/* 2. 만족도 */}
              <section className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-5">
                <label className="block text-xs font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-3">
                  하루 만족도
                </label>
                <SatisfactionSlider value={satisfaction} onChange={setSatisfaction} />
              </section>

              {/* 3. 날씨 */}
              <section className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-5">
                <label className="block text-xs font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-3">
                  오늘의 날씨
                </label>
                <WeatherPicker value={weather} onChange={setWeather} />
              </section>

              {/* 4. 키워드 */}
              <section className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-5">
                <label className="block text-xs font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-3">
                  오늘의 키워드
                </label>
                <KeywordPicker value={keywords} onChange={setKeywords} />
              </section>

              {/* 5. 회고 */}
              <section className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-5">
                <label className="block text-xs font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-4">
                  오늘의 회고
                </label>
                <ReflectionInput
                  goodThings={goodThings}
                  badThings={badThings}
                  onGoodChange={setGoodThings}
                  onBadChange={setBadThings}
                />
              </section>

              {/* 6. 일기 본문 */}
              <section className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-5">
                <label className="block text-xs font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-3">
                  오늘 하루
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="오늘 하루를 기록해보세요..."
                  rows={8}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none transition-colors"
                />
              </section>

              {submitError && (
                <p className="text-sm text-red-500 dark:text-red-400 text-center">
                  {submitError}
                </p>
              )}

              <div className="pt-2">
                <button
                  onClick={() => id && handleUpdate(id)}
                  disabled={!canSubmit}
                  className={`w-full py-3.5 rounded-xl text-sm font-bold transition-colors ${
                    canSubmit
                      ? 'bg-teal-500 text-white hover:bg-teal-600'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? '저장 중...' : '수정 완료'}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DiaryEditPage;
