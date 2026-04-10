import React from 'react';

const LABELS: Record<number, string> = {
  1: '매우 불만족',
  2: '불만족',
  3: '보통',
  4: '만족',
  5: '매우 만족',
};

const COLORS: Record<number, string> = {
  1: 'text-red-500 dark:text-red-400',
  2: 'text-orange-500 dark:text-orange-400',
  3: 'text-yellow-500 dark:text-yellow-400',
  4: 'text-teal-500 dark:text-teal-400',
  5: 'text-teal-600 dark:text-teal-300',
};

interface SatisfactionSliderProps {
  value: number | null;
  onChange: (value: number | null) => void;
}

const SatisfactionSlider: React.FC<SatisfactionSliderProps> = ({ value, onChange }) => {
  const current = value ?? 3;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-slate-900 dark:text-white">
          {value ?? '—'}
        </span>
        <span className={`text-sm font-semibold ${value ? COLORS[value] : 'text-slate-400 dark:text-slate-500'}`}>
          {value ? LABELS[value] : '선택 안 함'}
        </span>
      </div>

      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={current}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer accent-teal-500 bg-slate-200 dark:bg-slate-700"
      />

      <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-500 px-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n}>{n}</span>
        ))}
      </div>

      {value !== null && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          선택 해제
        </button>
      )}
    </div>
  );
};

export default SatisfactionSlider;
