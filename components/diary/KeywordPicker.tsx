import React, { useState } from 'react';
import { X } from 'lucide-react';

const MAX_KEYWORDS = 5;

const PRESET_KEYWORDS = ['운동', '회의', '공부', '여행', '휴식', '독서', '요리', '쇼핑', '친구', '가족'];

interface KeywordPickerProps {
  value: string[];
  onChange: (keywords: string[]) => void;
}

const KeywordPicker: React.FC<KeywordPickerProps> = ({ value, onChange }) => {
  const [input, setInput] = useState('');

  function toggle(keyword: string) {
    if (value.includes(keyword)) {
      onChange(value.filter((k) => k !== keyword));
    } else {
      if (value.length >= MAX_KEYWORDS) return;
      onChange([...value, keyword]);
    }
  }

  function addCustom() {
    const trimmed = input.trim().replace(/[#\s]+/g, '');
    if (!trimmed || value.includes(trimmed) || value.length >= MAX_KEYWORDS) {
      setInput('');
      return;
    }
    onChange([...value, trimmed]);
    setInput('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustom();
    }
  }

  return (
    <div className="space-y-3">
      {/* 프리셋 */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {PRESET_KEYWORDS.map((keyword) => {
          const selected = value.includes(keyword);
          const disabled = !selected && value.length >= MAX_KEYWORDS;
          return (
            <button
              key={keyword}
              type="button"
              onClick={() => toggle(keyword)}
              disabled={disabled}
              className={`min-w-0 rounded-full px-1.5 py-1.5 text-center text-xs sm:text-sm font-medium transition-colors ${
                selected
                  ? 'bg-teal-500 text-white'
                  : disabled
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              #{keyword}
            </button>
          );
        })}
      </div>

      {/* 선택된 커스텀 태그 (프리셋에 없는 것) */}
      {value.filter((k) => !PRESET_KEYWORDS.includes(k)).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value
            .filter((k) => !PRESET_KEYWORDS.includes(k))
            .map((keyword) => (
              <span
                key={keyword}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-teal-500 text-white"
              >
                #{keyword}
                <button
                  type="button"
                  onClick={() => onChange(value.filter((k) => k !== keyword))}
                  className="hover:opacity-70 transition-opacity"
                  aria-label={`${keyword} 제거`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
        </div>
      )}

      {/* 직접 입력 */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length >= MAX_KEYWORDS ? `최대 ${MAX_KEYWORDS}개까지 가능해요` : '직접 입력 후 Enter'}
          disabled={value.length >= MAX_KEYWORDS}
          className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 transition-colors"
        />
        <button
          type="button"
          onClick={addCustom}
          disabled={!input.trim() || value.length >= MAX_KEYWORDS}
          className="w-full rounded-xl bg-teal-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-600 disabled:opacity-40 sm:w-auto"
        >
          추가
        </button>
      </div>

      <p className="text-[11px] text-slate-400 dark:text-slate-500">
        {value.length}/{MAX_KEYWORDS}개 선택됨
      </p>
    </div>
  );
};

export default KeywordPicker;
