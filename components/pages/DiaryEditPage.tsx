import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, X } from 'lucide-react';
import { useDiaryForm } from '../../hooks/useDiaryForm';
import { getDiaryById } from '../../api/diaryMock';
import EmotionPicker from '../diary/EmotionPicker';
import WeatherPicker from '../diary/WeatherPicker';
import EnergySlider from '../diary/EnergySlider';
import SatisfactionSlider from '../diary/SatisfactionSlider';
import KeywordPicker from '../diary/KeywordPicker';
import ReflectionInput from '../diary/ReflectionInput';
import UniversalHeader from '../layout/UniversalHeader';

interface DiaryEditPageProps {
  id: string;
  onBack: () => void;
  onSaved: (id: string) => void;
}

const DiaryEditPage: React.FC<DiaryEditPageProps> = ({ id, onBack, onSaved }) => {
  const [isLoadingDiary, setIsLoadingDiary] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const shouldScrollToEndRef = useRef(false);
  const MAX_IMAGES = 9;
  const [loadingImagesCount, setLoadingImagesCount] = useState(0);

  const {
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
    isSubmitting, submitError, canSubmit,
    initForm,
    handleUpdate,
  } = useDiaryForm({ onUpdateSuccess: onSaved });

  useEffect(() => {
    async function load() {
      try {
        const diary = await getDiaryById(id);
        initForm({
          date: diary.date,
          emotion: diary.emotion,
          weather: diary.weather,
          content: diary.content,
          energy: diary.energy,
          satisfaction: diary.satisfaction,
          keywords: diary.keywords,
          achievement: diary.achievement,
          regret: diary.regret,
          images: diary.images,
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

  useEffect(() => {
    if (shouldScrollToEndRef.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: scrollContainerRef.current.scrollWidth,
        behavior: 'smooth',
      });
      if (loadingImagesCount === 0) {
        shouldScrollToEndRef.current = false;
      }
    }
  }, [images, loadingImagesCount]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remaining = MAX_IMAGES - images.length;
    const filesToProcess = Math.min(files.length, remaining);
    if (filesToProcess <= 0) return;

    shouldScrollToEndRef.current = true;
    setLoadingImagesCount(filesToProcess);

    Array.from<File>(files).slice(0, filesToProcess).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const dataUrl = reader.result;
          setImages((prev) => [...prev, dataUrl]);
        }
        setLoadingImagesCount((prev) => Math.max(0, prev - 1));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] transition-colors flex flex-col">
      <UniversalHeader
        title="일기 수정"
        onBack={onBack}
        showBack={true}
      />

      <main className="flex-1 overflow-y-auto pt-16 pb-[calc(4rem+env(safe-area-inset-bottom)+1.5rem)]">
        <div className="mx-auto w-full max-w-2xl px-4 py-5 md:px-5 md:py-6">
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

              {/* 사진 */}
              <section className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-5">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                    사진
                  </label>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    {images.length}/{MAX_IMAGES}
                  </span>
                </div>
                <div ref={scrollContainerRef} className="flex gap-3 overflow-x-auto no-scrollbar">
                  {images.map((img, i) => (
                    <div key={i} className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden group">
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                        onLoad={() => {
                          /* image loaded successfully */
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {loadingImagesCount > 0 &&
                    Array.from({ length: loadingImagesCount }).map((_, i) => (
                      <div
                        key={`loading-${i}`}
                        className="w-24 h-24 flex-shrink-0 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse"
                      />
                    ))}
                  {images.length < MAX_IMAGES && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-24 h-24 flex-shrink-0 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-500 hover:border-teal-400 hover:text-teal-500 transition-colors"
                    >
                      <Camera size={20} />
                      <span className="text-[10px] font-medium">사진 추가</span>
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </section>

              {/* 오늘 하루 */}
              <section className="flex-1 flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 overflow-hidden">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="오늘 하루를 기록해보세요..."
                  maxLength={2500}
                  className="flex-1 w-full min-h-[200px] bg-transparent px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none resize-none transition-colors"
                />
                <div className="px-4 pb-2 text-right text-[11px] text-slate-400 dark:text-slate-500">
                  {content.length}/2500
                </div>
              </section>

              {/* 감정 */}
              <section className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-5">
                <label className="block text-xs font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-3">
                  오늘의 감정
                </label>
                <EmotionPicker value={emotion} onChange={setEmotion} />
              </section>

              {/* 날씨 */}
              <section className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-5">
                <label className="block text-xs font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-3">
                  오늘의 날씨
                </label>
                <WeatherPicker value={weather} onChange={setWeather} />
              </section>

              {/* 에너지 */}
              <section className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-5">
                <label className="block text-xs font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-3">
                  에너지
                </label>
                <EnergySlider value={energy} onChange={setEnergy} />
              </section>

              {/* 만족도 */}
              <section className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-5">
                <label className="block text-xs font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-3">
                  하루 만족도
                </label>
                <SatisfactionSlider value={satisfaction} onChange={setSatisfaction} />
              </section>

              {/* 키워드 */}
              <section className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-5">
                <label className="block text-xs font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-3">
                  오늘의 키워드
                </label>
                <KeywordPicker value={keywords} onChange={setKeywords} />
              </section>

              {/* 회고 */}
              <section className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-5">
                <label className="block text-xs font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-4">
                  오늘의 회고
                </label>
                <ReflectionInput
                  goodThings={achievement}
                  badThings={regret}
                  onGoodChange={setAchievement}
                  onBadChange={setRegret}
                />
              </section>

              {submitError && (
                <p className="text-sm text-red-500 dark:text-red-400 text-center">
                  {submitError}
                </p>
              )}

              <div className="pt-2">
                <button
                  onClick={() => handleUpdate(id)}
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
