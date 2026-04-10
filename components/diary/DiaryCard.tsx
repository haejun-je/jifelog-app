import React from 'react';
import { motion } from 'framer-motion';
import { Diary } from '../../types';
import { EMOTION_OPTIONS, WEATHER_OPTIONS } from './diaryOptions';

interface DiaryCardProps {
  diary: Diary;
  onClick: (id: string) => void;
  index?: number;
}

const DiaryCard: React.FC<DiaryCardProps> = ({ diary, onClick, index = 0 }) => {
  const formattedDate = new Date(diary.date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  const emotionOption = diary.emotion
    ? EMOTION_OPTIONS.find((o) => o.key === diary.emotion)
    : null;

  const weatherOption = diary.weather
    ? WEATHER_OPTIONS.find((o) => o.key === diary.weather)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => onClick(diary.id)}
      className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-4 cursor-pointer hover:border-teal-400 dark:hover:border-teal-500 transition-colors"
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {formattedDate}
        </span>
        <div className="flex items-center gap-2">
          {emotionOption && (
            <span
              className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              title={emotionOption.label}
            >
              <emotionOption.icon size={14} />
              <span>{emotionOption.label}</span>
            </span>
          )}
          {weatherOption && (
            <span
              className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              title={weatherOption.label}
            >
              <weatherOption.icon size={14} />
              <span>{weatherOption.label}</span>
            </span>
          )}
          {diary.satisfaction !== null && (
            <span
              className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              title={`만족도 ${diary.satisfaction}점`}
            >
              <span aria-hidden="true">★</span>
              <span>{diary.satisfaction}</span>
            </span>
          )}
        </div>
      </div>

      {diary.content ? (
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200 line-clamp-2">
          {diary.content}
        </p>
      ) : (
        <p className="text-sm text-slate-400 dark:text-slate-500 italic">내용 없음</p>
      )}

      {diary.keywords.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {diary.keywords.map((keyword) => (
            <span
              key={keyword}
              className="rounded-full bg-teal-50 dark:bg-teal-500/10 px-2.5 py-1 text-xs font-medium text-teal-700 dark:text-teal-300"
            >
              #{keyword}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default DiaryCard;
