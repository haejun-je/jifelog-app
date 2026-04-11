import React from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Check, ChevronRight, Plus, X } from 'lucide-react';
import type { CalendarCategory } from '../../calendar/CalendarSidebar';
import type { Schedule, Todo } from './types';

interface DayScheduleModalProps {
    date: Date;
    schedules: Schedule[];
    todos: Todo[];
    calendars: CalendarCategory[];
    onClose: () => void;
    onSelectSchedule: (schedule: Schedule) => void;
    onSelectTodo: (todo: Todo) => void;
    onToggleTodo: (id: string) => void;
    onCreateSchedule: () => void;
    onCreateTodo: () => void;
}

const DayScheduleModal: React.FC<DayScheduleModalProps> = ({
    date,
    schedules,
    todos,
    calendars,
    onClose,
    onSelectSchedule,
    onSelectTodo,
    onToggleTodo,
    onCreateSchedule,
    onCreateTodo,
}) => {
    const formatTime = (schedule: Schedule) => {
        if (schedule.allDay) return '종일';
        const start = new Date(schedule.start);
        const end = new Date(schedule.end);
        return `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`;
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                className="relative w-full sm:max-w-md h-[65vh] bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
                <div className="p-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">일정 & 할 일</p>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white">
                            {date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}
                        </h3>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                    {schedules.length > 0 && (
                        <>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 pb-1">일정</p>
                            {schedules.map((schedule) => {
                                const calendar = calendars.find((item) => item.id === schedule.calendarId);
                                return (
                                    <button
                                        key={schedule.id}
                                        onClick={() => onSelectSchedule(schedule)}
                                        className="w-full text-left bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3.5 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-3"
                                    >
                                        <div className="w-2 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: calendar?.color }} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{schedule.title}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">{formatTime(schedule)}{schedule.location && ` · ${schedule.location}`}</p>
                                        </div>
                                        <ChevronRight size={14} className="text-slate-300 flex-shrink-0" />
                                    </button>
                                );
                            })}
                        </>
                    )}
                    {todos.length > 0 && (
                        <>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 pb-1 pt-2">할 일</p>
                            {todos.map((todo) => (
                                <div key={todo.id} className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3.5 flex items-center gap-3">
                                    <button
                                        onClick={() => onToggleTodo(todo.id)}
                                        className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-colors ${todo.completed ? 'bg-violet-500 border-violet-500' : 'border-slate-300 dark:border-slate-600 hover:border-violet-400'}`}
                                    >
                                        {todo.completed && <Check size={11} className="text-white" strokeWidth={3} />}
                                    </button>
                                    <button onClick={() => onSelectTodo(todo)} className="flex-1 min-w-0 text-left">
                                        <p className={`text-sm font-bold truncate ${todo.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>{todo.title}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{todo.allDay ? '하루종일' : todo.time}</p>
                                    </button>
                                    <ChevronRight size={14} className="text-slate-300 flex-shrink-0" />
                                </div>
                            ))}
                        </>
                    )}
                    {schedules.length === 0 && todos.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-300 dark:text-slate-600">
                            <CalendarIcon size={28} className="mb-3" />
                            <p className="text-sm font-semibold">항목이 없습니다</p>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-slate-100 dark:border-white/5 grid grid-cols-2 gap-2">
                    <button
                        onClick={onCreateSchedule}
                        className="h-11 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 hover:text-teal-600 hover:border-teal-400 hover:bg-teal-50/50 dark:hover:bg-teal-500/5 transition-colors flex items-center justify-center gap-1.5"
                    >
                        <Plus size={14} /> 일정 추가
                    </button>
                    <button
                        onClick={onCreateTodo}
                        className="h-11 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 hover:text-violet-600 hover:border-violet-400 hover:bg-violet-50/50 dark:hover:bg-violet-500/5 transition-colors flex items-center justify-center gap-1.5"
                    >
                        <Check size={14} /> 할 일 추가
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default DayScheduleModal;
