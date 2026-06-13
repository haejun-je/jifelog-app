import React, { useState } from 'react';
import { X } from 'lucide-react';

const MAX_KEYWORDS = 5;

interface KeywordPickerProps {
  value: string[];
  onChange: (keywords: string[]) => void;
}

const KeywordPicker: React.FC<KeywordPickerProps> = ({ value, onChange }) => {
  const [input, setInput] = useState('');

  function addKeyword() {
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
      addKeyword();
    }
  }

  function removeKeyword(keyword: string) {
    onChange(value.filter((k) => k !== keyword));
  }

  return (
    <div className="space-y-3">
      {/* 키워드 라벨 */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((keyword) => (
            <span
              key={keyword}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              #{keyword}
              <button
                type="button"
                onClick={() => removeKeyword(keyword)}
                className="hover:opacity-70 transition-opacity"
                aria-label={`${keyword} 제거`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* 입력 */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length >= MAX_KEYWORDS ? `최대 ${MAX_KEYWORDS}개까지 가능해요` : '키워드를 입력 후 Enter'}
          disabled={value.length >= MAX_KEYWORDS}
          className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 transition-colors"
        />
        <button
          type="button"
          onClick={addKeyword}
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