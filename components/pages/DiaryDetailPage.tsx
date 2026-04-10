import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pencil, Trash2, ThumbsUp, ThumbsDown } from 'lucide-react';
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

const DiaryDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [diary, setDiary] = useState<Diary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    if (!window.confirm('일기를 삭제할까요? 이 작업은 되돌릴 수 없습니다.')) return;
    setIsDeleting(true);
    try {
      await deleteDiary(id);
      navigate('/diary');
    } catch (e: unknown) {
      const err = e as Error;
      alert(err.message ?? '삭제에 실패했습니다.');
      setIsDeleting(false);
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] transition-colors flex flex-col">
      <UniversalHeader
        title="일기"
        onBack={() => navigate('/diary')}
        showBack={true}
        rightAction={
          diary && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigate(`/diary/${id}/edit`)}
                className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="수정"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                aria-label="삭제"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )
        }
      />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 md:px-5 py-5 md:py-6 pb-12">
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

              {/* 감정 & 날씨 & 만족도 */}
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
                {diary.satisfaction !== null && (
                  <div className={`rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-4 flex flex-col items-center gap-2 ${!emotionOption && !weatherOption ? 'col-span-2' : ''}`}>
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
    </div>
  );
};

export default DiaryDetailPage;
