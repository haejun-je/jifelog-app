import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDiaryForm } from '../../hooks/useDiaryForm';
import EmotionPicker from '../diary/EmotionPicker';
import WeatherPicker from '../diary/WeatherPicker';
import SatisfactionSlider from '../diary/SatisfactionSlider';
import KeywordPicker from '../diary/KeywordPicker';
import ReflectionInput from '../diary/ReflectionInput';
import UniversalHeader from '../layout/UniversalHeader';

const DiaryWritePage: React.FC = () => {
  const navigate = useNavigate();
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
    handleCreate,
  } = useDiaryForm();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] transition-colors flex flex-col">
      <UniversalHeader
        title="일기 쓰기"
        onBack={() => navigate('/diary')}
        showBack={true}
      />

      <main className="flex-1 overflow-y-auto pb-[calc(4rem+env(safe-area-inset-bottom)+1.5rem)] md:pb-10">
        <div className="max-w-2xl mx-auto px-4 md:px-5 md:py-6">
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

            {/* 5. 잘한 일 / 아쉬운 일 */}
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
              <p className="text-sm text-red-500 dark:text-red-400 text-center">{submitError}</p>
            )}

            <div className="pt-2">
              <button
                onClick={handleCreate}
                disabled={!canSubmit}
                className={`w-full py-3.5 rounded-xl text-sm font-bold transition-colors ${
                  canSubmit
                    ? 'bg-teal-500 text-white hover:bg-teal-600'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? '저장 중...' : '저장'}
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default DiaryWritePage;
