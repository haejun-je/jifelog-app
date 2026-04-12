import React from 'react';

interface LevelSliderProps {
  value: number | null;
  onChange: (value: number | null) => void;
  labels: Record<number, string>;
  colors: Record<number, string>;
}

const LevelSlider: React.FC<LevelSliderProps> = ({ value, onChange, labels, colors }) => {
  const current = value ?? 3;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-slate-900 dark:text-white">
          {value ?? '—'}
        </span>
        <span className={`text-sm font-semibold ${value ? colors[value] : 'text-slate-400 dark:text-slate-500'}`}>
          {value ? labels[value] : '선택 안 함'}
        </span>
      </div>

      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={current}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-teal-500 dark:bg-slate-700"
      />

      <div className="flex justify-between px-0.5 text-[11px] text-slate-400 dark:text-slate-500">
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n}>{n}</span>
        ))}
      </div>

      {value !== null && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="text-xs text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
        >
          선택 해제
        </button>
      )}
    </div>
  );
};

export default LevelSlider;
