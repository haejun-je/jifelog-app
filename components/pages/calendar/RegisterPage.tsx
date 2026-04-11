import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlignLeft, ChevronDown, ChevronLeft, Clock, MapPin } from 'lucide-react';
import type { CalendarCategory } from '../../calendar/CalendarSidebar';
import type { Schedule, Todo } from './types';

interface RegisterPageProps {
    selectedDate: Date;
    editingSchedule: Schedule | null;
    editingTodo: Todo | null;
    calendars: CalendarCategory[];
    initialTab: 'schedule' | 'todo';
    onCancel: () => void;
    onSaveSchedule: (data: Omit<Schedule, 'id'>) => void;
    onSaveTodo: (data: Omit<Todo, 'id' | 'completed' | 'createdAt'>) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({
    selectedDate,
    editingSchedule,
    editingTodo,
    calendars,
    initialTab,
    onCancel,
    onSaveSchedule,
    onSaveTodo,
}) => {
    const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);
    const isEditing = editingSchedule !== null || editingTodo !== null;
    const fixedTab: 'schedule' | 'todo' | null = editingSchedule ? 'schedule' : editingTodo ? 'todo' : null;
    const [activeTab, setActiveTab] = useState<'schedule' | 'todo'>(fixedTab || initialTab);

    const defaultDateStr = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

    const [title, setTitle] = useState(editingSchedule?.title || '');
    const [start, setStart] = useState(editingSchedule?.start || defaultDateStr);
    const [end, setEnd] = useState(editingSchedule?.end || new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000 + 3600000).toISOString().slice(0, 16));
    const [allDay, setAllDay] = useState(editingSchedule?.allDay ?? false);
    const [calendarId, setCalendarId] = useState(editingSchedule?.calendarId || calendars[0]?.id);
    const [description, setDescription] = useState(editingSchedule?.description || '');
    const [location, setLocation] = useState(editingSchedule?.location || '');

    const [todoTitle, setTodoTitle] = useState(editingTodo?.title || '');
    const [todoDate, setTodoDate] = useState(
        editingTodo?.date ||
        new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
    );
    const [todoAllDay, setTodoAllDay] = useState(editingTodo?.allDay ?? true);
    const [todoTime, setTodoTime] = useState(editingTodo?.time || '09:00');
    const [todoMemo, setTodoMemo] = useState(editingTodo?.memo || '');

    const pageTitle = isEditing
        ? (fixedTab === 'schedule' ? '일정 수정' : '할 일 수정')
        : (activeTab === 'schedule' ? '새 일정' : '새 할 일');

    const handleSave = () => {
        if (activeTab === 'schedule') {
            if (!title) return;
            onSaveSchedule({ title, start, end, allDay, calendarId, description, location });
            return;
        }

        if (!todoTitle) return;
        onSaveTodo({
            title: todoTitle,
            date: todoDate,
            allDay: todoAllDay,
            time: todoAllDay ? undefined : todoTime,
            memo: todoMemo || undefined,
        });
    };

    const isValid = activeTab === 'schedule' ? !!title.trim() : !!todoTitle.trim();

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center h-16 px-2 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-white/5 flex-shrink-0">
                <button onClick={onCancel} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <ChevronLeft size={22} className="text-slate-600 dark:text-slate-300" />
                </button>
                <h1 className="flex-1 text-center text-base font-black text-slate-900 dark:text-white">{pageTitle}</h1>
                <div className="w-10" />
            </div>

            {!isEditing && (
                <div className="px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-white/5 flex-shrink-0">
                    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 gap-1">
                        <button
                            onClick={() => setActiveTab('schedule')}
                            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'schedule' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                        >
                            일정
                        </button>
                        <button
                            onClick={() => setActiveTab('todo')}
                            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'todo' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                        >
                            할 일
                        </button>
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                    {activeTab === 'schedule' ? (
                        <motion.div key="schedule-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="p-4 space-y-3">
                            <div className="bg-white dark:bg-slate-900 rounded-2xl px-4 py-4">
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(event) => setTitle(event.target.value)}
                                    placeholder="제목을 입력하세요"
                                    className="w-full bg-transparent text-lg font-black outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600 text-slate-900 dark:text-white"
                                    autoFocus
                                />
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-2xl px-4 py-3 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Clock size={17} className="text-slate-400" />
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">종일</span>
                                    </div>
                                    <button
                                        onClick={() => setAllDay(!allDay)}
                                        className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${allDay ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${allDay ? 'left-6' : 'left-1'}`} />
                                    </button>
                                </div>
                                <div className="h-px bg-slate-100 dark:bg-white/5" />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-500">시작</span>
                                    <input
                                        type={allDay ? 'date' : 'datetime-local'}
                                        value={allDay ? start.split('T')[0] : start}
                                        onChange={(event) => setStart(event.target.value)}
                                        className={`calendar-picker-input ${isAndroid ? 'android-picker-input' : ''} text-sm font-medium bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-1.5 pr-3 outline-none text-slate-700 dark:text-slate-200`}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-500">종료</span>
                                    <input
                                        type={allDay ? 'date' : 'datetime-local'}
                                        value={allDay ? end.split('T')[0] : end}
                                        onChange={(event) => setEnd(event.target.value)}
                                        className={`calendar-picker-input ${isAndroid ? 'android-picker-input' : ''} text-sm font-medium bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-1.5 pr-3 outline-none text-slate-700 dark:text-slate-200`}
                                    />
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-2xl px-4 py-3 space-y-2.5">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-wider">캘린더</p>
                                <div className="relative">
                                    <select
                                        value={calendarId}
                                        onChange={(event) => setCalendarId(event.target.value)}
                                        className="w-full appearance-none rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-3 pr-10 text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none"
                                    >
                                        {calendars.map((calendar) => (
                                            <option key={calendar.id} value={calendar.id}>
                                                {calendar.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-2xl px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <MapPin size={17} className="text-slate-400 flex-shrink-0" />
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(event) => setLocation(event.target.value)}
                                        placeholder="장소 추가"
                                        className="flex-1 text-sm outline-none bg-transparent text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-2xl px-4 py-3">
                                <div className="flex items-start gap-3">
                                    <AlignLeft size={17} className="text-slate-400 flex-shrink-0 mt-0.5" />
                                    <textarea
                                        value={description}
                                        onChange={(event) => setDescription(event.target.value)}
                                        placeholder="메모 추가"
                                        className="flex-1 text-sm outline-none bg-transparent text-slate-700 dark:text-slate-200 placeholder:text-slate-400 resize-none h-20 leading-relaxed"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="todo-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="p-4 space-y-3">
                            <div className="bg-white dark:bg-slate-900 rounded-2xl px-4 py-4">
                                <input
                                    type="text"
                                    value={todoTitle}
                                    onChange={(event) => setTodoTitle(event.target.value)}
                                    placeholder="제목을 입력하세요"
                                    className="w-full bg-transparent text-lg font-black outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600 text-slate-900 dark:text-white"
                                    autoFocus={activeTab === 'todo' || editingTodo !== null}
                                />
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-2xl px-4 py-3 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Clock size={17} className="text-slate-400" />
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">하루종일</span>
                                    </div>
                                    <button
                                        onClick={() => setTodoAllDay(!todoAllDay)}
                                        className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${todoAllDay ? 'bg-violet-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${todoAllDay ? 'left-6' : 'left-1'}`} />
                                    </button>
                                </div>
                                <div className="h-px bg-slate-100 dark:bg-white/5" />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-500">날짜</span>
                                    <input
                                        type="date"
                                        value={todoDate}
                                        onChange={(event) => setTodoDate(event.target.value)}
                                        className={`calendar-picker-input ${isAndroid ? 'android-picker-input' : ''} text-sm font-medium bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-1.5 pr-3 outline-none text-slate-700 dark:text-slate-200`}
                                    />
                                </div>
                                <AnimatePresence>
                                    {!todoAllDay && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="flex items-center justify-between overflow-hidden">
                                            <span className="text-sm text-slate-500">시간</span>
                                            <input
                                                type="time"
                                                value={todoTime}
                                                onChange={(event) => setTodoTime(event.target.value)}
                                                className={`calendar-picker-input ${isAndroid ? 'android-picker-input' : ''} text-sm font-medium bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-1.5 pr-3 outline-none text-slate-700 dark:text-slate-200`}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-2xl px-4 py-3">
                                <div className="flex items-start gap-3">
                                    <AlignLeft size={17} className="text-slate-400 flex-shrink-0 mt-0.5" />
                                    <textarea
                                        value={todoMemo}
                                        onChange={(event) => setTodoMemo(event.target.value)}
                                        placeholder="메모 추가"
                                        className="flex-1 text-sm outline-none bg-transparent text-slate-700 dark:text-slate-200 placeholder:text-slate-400 resize-none h-20 leading-relaxed"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="px-4 py-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-white/5 flex gap-3 flex-shrink-0">
                <button
                    onClick={onCancel}
                    className="flex-1 py-3.5 rounded-2xl font-bold text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                    취소
                </button>
                <button
                    onClick={handleSave}
                    disabled={!isValid}
                    className={`flex-1 py-3.5 rounded-2xl font-bold text-sm text-white transition-all disabled:opacity-30 ${activeTab === 'schedule' ? 'bg-teal-500 shadow-lg shadow-teal-500/20 hover:bg-teal-600' : 'bg-violet-500 shadow-lg shadow-violet-500/20 hover:bg-violet-600'}`}
                >
                    저장
                </button>
            </div>
            <style>{`
                .calendar-picker-input::-webkit-calendar-picker-indicator {
                    margin-right: 6px;
                }

                .android-picker-input {
                    appearance: none;
                    -webkit-appearance: none;
                    background-image: none;
                }

                .android-picker-input::-webkit-calendar-picker-indicator {
                    opacity: 0;
                    width: 0;
                    margin: 0;
                }
            `}</style>
        </div>
    );
};

export default RegisterPage;
