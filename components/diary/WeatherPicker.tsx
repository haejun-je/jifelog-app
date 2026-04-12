import React from 'react';
import { WEATHER_OPTIONS } from './diaryOptions';

interface WeatherPickerProps {
  value: string | null;
  onChange: (weather: string | null) => void;
}

const WeatherPicker: React.FC<WeatherPickerProps> = ({ value, onChange }) => {
  return (
    <div className="no-scrollbar flex w-full min-w-0 gap-2 overflow-x-auto overscroll-x-contain pb-1">
      {WEATHER_OPTIONS.map((option) => {
        const Icon = option.icon;
        const isSelected = value === option.key;
        return (
          <button
            key={option.key}
            type="button"
            onClick={() => onChange(isSelected ? null : option.key)}
            className={`flex h-[72px] min-w-[64px] flex-shrink-0 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2.5 text-center transition-colors ${
              isSelected
                ? 'bg-teal-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Icon size={20} />
            <span className="text-[11px] font-medium">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default WeatherPicker;
