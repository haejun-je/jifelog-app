import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlignLeft, Check, ChevronLeft, Clock, Trash, X } from 'lucide-react';
import type { Todo } from './types';
import { formatKoreanDate } from './utils';

interface TodoDetailPageProps {
    todo: Todo;
    onBack: () => void;
    onEdit: () => void;
    onDelete: (id: string) => void;
    onToggleComplete: (id: string) => void;
}

const TodoDetailPage: React.FC<TodoDetailPageProps> = ({ todo, onBack, onEdit, onDelete, onToggleComplete }) => {
    const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);
    const todoDate = new Date(todo.date + 'T00:00:00');
    const createdAt = new Date(todo.createdAt);

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center h-16 px-2 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-white/5 flex-shrink-0">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <ChevronLeft size={22} className="text-slate-600 dark:text-slate-300" />
                </button>
                <h1 className="flex-1 text-center text-base font-black text-slate-900 dark:text-white">할 일 상세</h1>
                <div className="w-10" />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-5">
                    <div className="flex items-start gap-3">
                        <button
                            onClick={() => onToggleComplete(todo.id)}
                            className={`w-6 h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center transition-colors mt-0.5 ${todo.completed ? 'bg-violet-500 border-violet-500' : 'border-slate-300 dark:border-slate-600 hover:border-violet-400'}`}
                        >
                            {todo.completed && <Check size={13} className="text-white" strokeWidth={3} />}
                        </button>
                        <div className="flex-1 min-w-0">
                            <h2 className={`text-xl font-black leading-tight ${todo.completed ? 'line-through text-slate-300 dark:text-slate-600' : 'text-slate-900 dark:text-white'}`}>
                                {todo.title}
                            </h2>
                            {todo.completed && (
                                <span className="inline-block mt-2 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-violet-50 dark:bg-violet-500/10 text-violet-500">
                                    완료됨
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl p-5">
                    <div className="flex items-center gap-3">
                        <Clock size={17} className="text-slate-400 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-white">{formatKoreanDate(todoDate)}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{todo.allDay ? '하루종일' : todo.time}</p>
                        </div>
                    </div>
                </div>

                {todo.memo && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5">
                        <div className="flex items-start gap-3">
                            <AlignLeft size={17} className="text-slate-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">{todo.memo}</p>
                        </div>
                    </div>
                )}

                <div className="px-1">
                    <p className="text-xs text-slate-300 dark:text-slate-600">
                        등록 · {createdAt.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>

            <div className="px-4 py-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-white/5 flex-shrink-0">
                <div className="grid grid-cols-4 gap-2">
                    <button onClick={() => onToggleComplete(todo.id)} className="py-3.5 rounded-2xl font-bold text-xs flex flex-col items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <Check size={16} strokeWidth={3} />
                        {todo.completed ? '취소' : '완료'}
                    </button>
                    <button onClick={onEdit} className="py-3.5 rounded-2xl font-bold text-xs flex flex-col items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <AlignLeft size={16} />
                        편집
                    </button>
                    <button onClick={() => setIsDeleteConfirm(true)} className="py-3.5 rounded-2xl font-bold text-xs flex flex-col items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <Trash size={16} />
                        삭제
                    </button>
                    <button onClick={onBack} className="py-3.5 rounded-2xl font-bold text-xs flex flex-col items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <X size={16} />
                        닫기
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isDeleteConfirm && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteConfirm(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-xs bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-5">
                            <h3 className="font-black text-slate-900 dark:text-white">할 일을 삭제할까요?</h3>
                            <p className="text-sm text-slate-400 mt-2">삭제하면 복구할 수 없습니다.</p>
                            <div className="grid grid-cols-2 gap-3 mt-5">
                                <button onClick={() => setIsDeleteConfirm(false)} className="py-2.5 rounded-xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm">취소</button>
                                <button onClick={() => onDelete(todo.id)} className="py-2.5 rounded-xl font-bold bg-red-500 text-white text-sm">삭제</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TodoDetailPage;
