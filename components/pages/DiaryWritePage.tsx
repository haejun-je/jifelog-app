import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, X } from 'lucide-react';
import { useDiaryForm } from '../../hooks/useDiaryForm';
import EmotionPicker from '../diary/EmotionPicker';
import WeatherPicker from '../diary/WeatherPicker';
import EnergySlider from '../diary/EnergySlider';
import SatisfactionSlider from '../diary/SatisfactionSlider';
import KeywordPicker from '../diary/KeywordPicker';
import ReflectionInput from '../diary/ReflectionInput';
import UniversalHeader from '../layout/UniversalHeader';

interface DiaryWritePageProps {
  onBack: () => void;
  onSaved: () => void;
}

const DiaryWritePage: React.FC<DiaryWritePageProps> = ({ onBack, onSaved }) => {
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
    handleCreate,
  } = useDiaryForm({ onCreateSuccess: onSaved });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_IMAGES = 9;
  const [loadingImagesCount, setLoadingImagesCount] = useState(0);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remaining = MAX_IMAGES - images.length;
    const filesToProcess = Math.min(files.length, remaining);
    if (filesToProcess <= 0) return;

    setLoadingImagesCount(filesToProcess);
    const newImages: string[] = [];
    let completedCount = 0;

    Array.from(files).slice(0, filesToProcess).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          newImages.push(reader.result);
        }
        completedCount++;
        if (completedCount === filesToProcess) {
          setImages((prev) => [...prev, ...newImages]);
          setLoadingImagesCount(0);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-slate-50 dark:bg-[#0f172a] transition-colors">
      <UniversalHeader
        title="일기 쓰기"
        onBack={onBack}
        showBack={true}
      />

      <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto pt-16 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] md:pb-6">
        <div className="mx-auto w-full max-w-2xl min-w-0 px-4 py-5 md:px-5 md:py-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* 날짜 */}
            <section className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-5">
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-3">
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
                <label className="block text-[11px] font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                  사진
                </label>
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                  {images.length}/{MAX_IMAGES}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                      onLoad={() => {
                        // Image loaded successfully
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
                {Array.from({ length: loadingImagesCount }).map((_, i) => (
                  <div key={`loading-${i}`} className="aspect-square rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
                ))}
                {images.length < MAX_IMAGES && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-500 hover:border-teal-400 hover:text-teal-500 transition-colors"
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

            <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
              {/* 감정 */}
              <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700/60 dark:bg-slate-900">
                <label className="block text-[11px] font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-3">
                  감정
                </label>
                <EmotionPicker value={emotion} onChange={setEmotion} />
              </section>

              {/* 날씨 */}
              <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700/60 dark:bg-slate-900">
                <label className="block text-[11px] font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-3">
                  날씨
                </label>
                <WeatherPicker value={weather} onChange={setWeather} />
              </section>

              {/* 에너지 */}
              <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700/60 dark:bg-slate-900 sm:col-span-2">
                <label className="block text-[11px] font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-3">
                  에너지
                </label>
                <EnergySlider value={energy} onChange={setEnergy} />
              </section>

              {/* 만족도 */}
              <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700/60 dark:bg-slate-900 sm:col-span-2">
                <label className="block text-[11px] font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-3">
                  만족도
                </label>
                <SatisfactionSlider value={satisfaction} onChange={setSatisfaction} />
              </section>
            </div>

            {/* 키워드 */}
            <section className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-5">
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-3">
                오늘의 키워드
              </label>
              <KeywordPicker value={keywords} onChange={setKeywords} />
            </section>

            {/* 회고 */}
            <section className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-5">
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-4">
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
