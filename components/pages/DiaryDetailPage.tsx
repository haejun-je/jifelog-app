import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Pencil, Trash2, ThumbsUp, ThumbsDown, X } from 'lucide-react';
import { Diary } from '../../types';
import { getDiaryById, deleteDiary } from '../../api/diaryMock';
import { EMOTION_OPTIONS, WEATHER_OPTIONS } from '../diary/diaryOptions';
import UniversalHeader from '../layout/UniversalHeader';

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

const DiaryDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [diary, setDiary] = useState<Diary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);
  const [isActionBarVisible, setIsActionBarVisible] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        const data = await getDiaryById(id!);
        setDiary(data);
      } catch (e: unknown) {
        const err = e as Error;
        setError(err.message ?? '일기를 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await deleteDiary(id);
      navigate('/diary');
    } catch (e: unknown) {
      const err = e as Error;
      alert(err.message ?? '삭제에 실패했습니다.');
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
        onBack={() => navigate('/diary')}
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
              {(diary.goodThings.length > 0 || diary.badThings.length > 0) && (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-4">
                    회고
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {diary.goodThings.length > 0 && (
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-teal-600 dark:text-teal-400">
                          <ThumbsUp size={14} />
                          <span>잘한 일</span>
                        </div>
                        <ul className="space-y-1.5">
                          {diary.goodThings.map((item, i) => (
                            <li key={i} className="text-sm text-slate-700 dark:text-slate-200 flex items-start gap-2">
                              <span className="text-teal-500 mt-0.5">·</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {diary.goodThings.length > 0 && diary.badThings.length > 0 && (
                      <div className="hidden sm:block w-px bg-slate-200 dark:bg-slate-700" />
                    )}
                    {diary.badThings.length > 0 && (
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400">
                          <ThumbsDown size={14} />
                          <span>아쉬운 일</span>
                        </div>
                        <ul className="space-y-1.5">
                          {diary.badThings.map((item, i) => (
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

              {/* 일기 본문 */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-3">
                  오늘 하루
                </p>
                {diary.content ? (
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
                    {diary.content}
                  </p>
                ) : (
                  <p className="text-sm text-slate-400 dark:text-slate-500 italic">
                    내용이 없습니다.
                  </p>
                )}
              </div>
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
              onClick={() => navigate(`/diary/${id}/edit`)}
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
              onClick={() => navigate('/diary')}
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
