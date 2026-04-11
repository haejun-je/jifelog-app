import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, BookOpen } from 'lucide-react';
import { Diary } from '../../types';
import { getDiaries } from '../../api/diaryMock';
import DiaryCard from '../diary/DiaryCard';
import UniversalHeader from '../layout/UniversalHeader';
import ScrollAwareFab from '../common/ScrollAwareFab';

const DiaryListPage: React.FC = () => {
  const navigate = useNavigate();
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getDiaries();
        setDiaries(data);
      } catch (e: unknown) {
        const err = e as Error;
        setError(err.message ?? '일기를 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] transition-colors flex flex-col">
      <UniversalHeader
        title="일기"
        showBack={false}
      />

      <main data-fab-scroll-container className="flex-1 overflow-y-auto w-full">
        <div className="max-w-3xl mx-auto px-4 md:px-5 pt-[calc(4rem+1.25rem)] md:pt-[calc(4rem+1.5rem)] pb-24">
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

          {!isLoading && !error && diaries.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 gap-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <BookOpen size={28} className="text-slate-400 dark:text-slate-500" />
              </div>
              <div className="text-center">
                <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
                  아직 작성한 일기가 없어요
                </p>
                <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
                  오늘 하루를 기록해보세요
                </p>
              </div>
              <button
                onClick={() => navigate('/diary/write')}
                className="mt-2 px-5 py-2.5 rounded-xl bg-teal-500 text-white text-sm font-semibold hover:bg-teal-600 transition-colors"
              >
                첫 일기 쓰기
              </button>
            </motion.div>
          )}

          {!isLoading && !error && diaries.length > 0 && (
            <div className="space-y-3">
              <AnimatePresence>
                {diaries.map((diary, i) => (
                  <DiaryCard
                    key={diary.id}
                    diary={diary}
                    index={i}
                    onClick={(id) => navigate(`/diary/${id}`)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      <ScrollAwareFab
        onClick={() => navigate('/diary/write')}
        ariaLabel="일기 작성"
      >
        <Plus size={28} />
      </ScrollAwareFab>
    </div>
  );
};

export default DiaryListPage;
