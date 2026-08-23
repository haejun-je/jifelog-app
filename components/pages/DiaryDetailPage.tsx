import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Pencil, Trash2, ThumbsUp, ThumbsDown, X } from 'lucide-react';
import { Diary, DiaryDetail, toEmotionKey, toWeatherKey } from '../../types';
import { getDiaryById, deleteDiary, ApiError } from '../../api/diary';
import { EMOTION_OPTIONS, WEATHER_OPTIONS } from '../diary/diaryOptions';
import UniversalHeader from '../layout/UniversalHeader';

const ImageCarousel: React.FC<{ images: string[] }> = ({ images }) => {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const mouseStartX = useRef<number | null>(null);

  const prev = () => setIndex((i) => Math.max(i - 1, 0));
  const next = () => setIndex((i) => Math.min(i + 1, images.length - 1));

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (delta > 40) next();
    else if (delta < -40) prev();
    touchStartX.current = null;
  };

  const onMouseDown = (e: React.MouseEvent) => {
    mouseStartX.current = e.clientX;
  };
  const onMouseUp = (e: React.MouseEvent) => {
    if (mouseStartX.current === null) return;
    const delta = mouseStartX.current - e.clientX;
    if (delta > 40) next();
    else if (delta < -40) prev();
    mouseStartX.current = null;
  };

  return (
    <div
      className="relative w-full h-52 overflow-hidden select-none cursor-grab active:cursor-grabbing"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      <div
        className="flex h-full w-full transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((src, i) => (
          <div key={i} className="w-full h-full flex-shrink-0">
            <img src={src} alt="" className="w-full h-full object-cover pointer-events-none" draggable={false} />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <span className="absolute top-2.5 right-2.5 text-[11px] font-semibold bg-black/50 text-white px-2 py-0.5 rounded-full">
          {index + 1} / {images.length}
        </span>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-2.5 left-0 right-0 flex justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                i === index ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const SATISFACTION_LABELS: Record<number, string> = {
  1: '매우 불만족',
  2: '불만족',
  3: '보통',
  4: '만족',
  5: '매우 만족',
};

const ENERGY_LABELS: Record<number, string> = {
  1: '매우 낮음',
  2: '낮음',
  3: '보통',
  4: '높음',
  5: '매우 높음',
};

interface DiaryDetailPageProps {
  id: string;
  onBack: () => void;
  onEdit: (id: string) => void;
  onDeleted: () => void;
}

const DiaryDetailPage: React.FC<DiaryDetailPageProps> = ({ id, onBack, onEdit, onDeleted }) => {
  const [diary, setDiary] = useState<Diary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);
  const [isActionBarVisible, setIsActionBarVisible] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data: DiaryDetail = await getDiaryById(id);
        if (cancelled) return;
        // 백엔드 응답(snake_case → camelCase)을 화면 UI 모델로 매핑한다.
        setDiary({
          id: data.id,
          date: data.entryDate,
          emotion: data.mood ? toEmotionKey(data.mood) : null,
          weather: data.weather ? toWeatherKey(data.weather) : null,
          content: data.content,
          energy: data.energyLevel,
          satisfaction: data.satisfactionLevel,
          keywords: data.keywords,
          achievement: data.achievement,
          regret: data.regret,
          // 상세 응답에 이미지 필드가 없으므로 빈 배열로 초기화한다.
          images: [],
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        });
      } catch (e: unknown) {
        if (cancelled) return;
        if (e instanceof ApiError && e.errorCode === 'EN_02_001') {
          // 존재하지 않는 일기: 사용자에게 알리고 목록으로 돌려보낸다.
          alert('존재하지 않는 일기입니다.');
          onBack();
          return;
        }
        const err = e as Error;
        setError(err.message ?? '일기를 불러오지 못했습니다.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();

    return () => {
      cancelled = true;
    };
  }, [id, onBack]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteDiary(id);
      onDeleted();
    } catch (e: unknown) {
      if (e instanceof ApiError) {
        if (e.errorCode === 'EN_02_001') {
          alert('존재하지 않는 일기입니다.');
        } else {
          alert(e.message);
        }
      } else {
        const err = e as Error;
        alert(err.message ?? '삭제에 실패했습니다.');
      }
      setIsDeleting(false);
      setIsDeleteConfirm(false);
    }
  };

  const emotionOption = diary?.emotion
    ? EMOTION_OPTIONS.find((o) => o.key === diary.emotion)
    : null;

  const weatherOption = diary?.weather
    ? WEATHER_OPTIONS.find((o) => o.key === diary.weather)
    : null;

  const formattedDate = diary
    ? new Date(diary.date).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      })
    : '';

  useEffect(() => {
    const handleScroll = (event: Event) => {
      const target = event.target;

      if (!(target instanceof HTMLElement) || !target.hasAttribute('data-diary-detail-scroll-container')) {
        return;
      }

      const currentScrollTop = target.scrollTop;
      const previousScrollTop = Number(target.dataset.lastScrollTop ?? '0');
      const scrollDelta = currentScrollTop - previousScrollTop;

      if (currentScrollTop <= 16 || scrollDelta < -2) {
        setIsActionBarVisible(true);
      } else if (scrollDelta > 2) {
        setIsActionBarVisible(false);
      }

      target.dataset.lastScrollTop = String(currentScrollTop);
    };

    document.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] transition-colors flex flex-col">
      <UniversalHeader
        title="일기"
        onBack={onBack}
        showBack={true}
      />

      <main data-diary-detail-scroll-container className="flex-1 overflow-y-auto pt-16">
        <div className="max-w-2xl mx-auto px-4 md:px-5 py-5 md:py-6">
          {isLoading && (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!isLoading && error && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/20 p-5 text-center"
            >
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </motion.div>
          )}

          {!isLoading && diary && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* 날짜 */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-1">
                  Date
                </p>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {formattedDate}
                </h2>
              </div>

              {/* 사진 */}
              {diary.images.length > 0 && (
                <div className="rounded-2xl overflow-hidden">
                  <ImageCarousel images={diary.images} />
                </div>
              )}

              {/* 오늘 하루 */}
              <div className="flex-1 flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 overflow-hidden">
                {diary.content ? (
                  <p className="flex-1 px-4 py-3 text-sm leading-relaxed text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
                    {diary.content}
                  </p>
                ) : (
                  <p className="flex-1 px-4 py-3 text-sm text-slate-400 dark:text-slate-500 italic">
                    내용이 없습니다.
                  </p>
                )}
              </div>

              {/* 감정 & 날씨 & 에너지 & 만족도 */}
              <div className="grid grid-cols-2 gap-3">
                {emotionOption && (
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-4 flex flex-col items-center gap-2">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                      감정
                    </p>
                    <emotionOption.icon size={28} className="text-slate-600 dark:text-slate-300" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {emotionOption.label}
                    </span>
                  </div>
                )}
                {weatherOption && (
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-4 flex flex-col items-center gap-2">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                      날씨
                    </p>
                    <weatherOption.icon size={28} className="text-slate-600 dark:text-slate-300" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {weatherOption.label}
                    </span>
                  </div>
                )}
                {diary.energy !== null && (
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-4 flex flex-col items-center gap-2">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                      에너지
                    </p>
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">
                      {diary.energy}
                    </span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {ENERGY_LABELS[diary.energy]}
                    </span>
                  </div>
                )}
                {diary.satisfaction !== null && (
                  <div className={`rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-4 flex flex-col items-center gap-2 ${!emotionOption && !weatherOption && diary.energy === null ? 'col-span-2' : ''}`}>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                      만족도
                    </p>
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">
                      {diary.satisfaction}
                    </span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {SATISFACTION_LABELS[diary.satisfaction]}
                    </span>
                  </div>
                )}
              </div>

              {/* 키워드 */}
              {diary.keywords.length > 0 && (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-3">
                    키워드
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {diary.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="px-3 py-1.5 rounded-full text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 회고 */}
              {(diary.achievement.length > 0 || diary.regret.length > 0) && (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-4">
                    회고
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {diary.achievement.length > 0 && (
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-teal-600 dark:text-teal-400">
                          <ThumbsUp size={14} />
                          <span>잘한 일</span>
                        </div>
                        <ul className="space-y-1.5">
                          {diary.achievement.map((item, i) => (
                            <li key={i} className="text-sm text-slate-700 dark:text-slate-200 flex items-start gap-2">
                              <span className="text-teal-500 mt-0.5">·</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {diary.achievement.length > 0 && diary.regret.length > 0 && (
                      <div className="hidden sm:block w-px bg-slate-200 dark:bg-slate-700" />
                    )}
                    {diary.regret.length > 0 && (
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400">
                          <ThumbsDown size={14} />
                          <span>아쉬운 일</span>
                        </div>
                        <ul className="space-y-1.5">
                          {diary.regret.map((item, i) => (
                            <li key={i} className="text-sm text-slate-700 dark:text-slate-200 flex items-start gap-2">
                              <span className="text-slate-400 mt-0.5">·</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>

      {diary && !isLoading && !error && (
        <div
          className={`fixed inset-x-0 bottom-0 z-40 border-t border-slate-100 bg-white px-4 py-4 transition-transform duration-200 ease-out dark:border-white/5 dark:bg-slate-900 ${
            isActionBarVisible ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="mx-auto grid max-w-2xl grid-cols-3 gap-2">
            <button
              onClick={() => onEdit(id)}
              className="flex flex-col items-center gap-1.5 rounded-2xl bg-slate-100 py-3.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <Pencil size={16} />
              편집
            </button>
            <button
              onClick={() => setIsDeleteConfirm(true)}
              disabled={isDeleting}
              className="flex flex-col items-center gap-1.5 rounded-2xl bg-slate-100 py-3.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <Trash2 size={16} />
              삭제
            </button>
            <button
              onClick={onBack}
              className="flex flex-col items-center gap-1.5 rounded-2xl bg-slate-100 py-3.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <X size={16} />
              닫기
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isDeleteConfirm && (
          <div className="absolute inset-0 z-30 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setIsDeleteConfirm(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xs rounded-2xl bg-white p-5 shadow-2xl dark:bg-slate-900"
            >
              <h3 className="font-black text-slate-900 dark:text-white">일기를 삭제할까요?</h3>
              <p className="mt-2 text-sm text-slate-400">삭제하면 복구할 수 없습니다.</p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="rounded-xl bg-slate-100 py-2.5 text-sm font-bold text-slate-700 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-200"
                >
                  취소
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white disabled:opacity-50"
                >
                  {isDeleting ? '삭제 중...' : '삭제'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiaryDetailPage;
