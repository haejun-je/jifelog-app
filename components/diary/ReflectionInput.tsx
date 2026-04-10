import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, X } from 'lucide-react';

interface ReflectionInputProps {
  goodThings: string[];
  badThings: string[];
  onGoodChange: (items: string[]) => void;
  onBadChange: (items: string[]) => void;
}

function ItemList({
  items,
  onRemove,
}: {
  items: string[];
  onRemove: (index: number) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-col gap-1.5 mb-2">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
        >
          <span className="text-sm text-slate-700 dark:text-slate-200 flex-1">{item}</span>
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex-shrink-0"
            aria-label="삭제"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

function ReflectionField({
  icon,
  label,
  placeholder,
  items,
  onAdd,
  onRemove,
  accentClass,
}: {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  items: string[];
  onAdd: (text: string) => void;
  onRemove: (index: number) => void;
  accentClass: string;
}) {
  const [input, setInput] = useState('');

  function submit() {
    const trimmed = input.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setInput('');
  }

  return (
    <div className="flex-1 space-y-2">
      <div className={`flex items-center gap-1.5 text-sm font-semibold ${accentClass}`}>
        {icon}
        <span>{label}</span>
      </div>
      <ItemList items={items} onRemove={onRemove} />
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={placeholder}
          className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
        />
        <button
          type="button"
          onClick={submit}
          disabled={!input.trim()}
          className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-semibold disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        >
          추가
        </button>
      </div>
    </div>
  );
}

const ReflectionInput: React.FC<ReflectionInputProps> = ({
  goodThings,
  badThings,
  onGoodChange,
  onBadChange,
}) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <ReflectionField
        icon={<ThumbsUp size={15} />}
        label="잘한 일"
        placeholder="오늘 잘한 일은?"
        items={goodThings}
        onAdd={(text) => onGoodChange([...goodThings, text])}
        onRemove={(i) => onGoodChange(goodThings.filter((_, idx) => idx !== i))}
        accentClass="text-teal-600 dark:text-teal-400"
      />
      <div className="hidden sm:block w-px bg-slate-200 dark:bg-slate-700" />
      <ReflectionField
        icon={<ThumbsDown size={15} />}
        label="아쉬운 일"
        placeholder="아쉬웠던 점은?"
        items={badThings}
        onAdd={(text) => onBadChange([...badThings, text])}
        onRemove={(i) => onBadChange(badThings.filter((_, idx) => idx !== i))}
        accentClass="text-slate-500 dark:text-slate-400"
      />
    </div>
  );
};

export default ReflectionInput;
