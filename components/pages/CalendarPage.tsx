import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Calendar as CalendarIcon,
    Check,
    CheckSquare,
    ChevronLeft,
    ChevronRight,
    Clock,
    MapPin,
    Plus,
} from 'lucide-react';
import CalendarSidebar, { CalendarCategory } from '../calendar/CalendarSidebar';
import ScrollAwareFab from '../common/ScrollAwareFab';
import UniversalHeader from '../layout/UniversalHeader';
import AddCalendarModal from './calendar/AddCalendarModal';
import CustomCalendarView from './calendar/CustomCalendarView';
import DayScheduleModal from './calendar/DayScheduleModal';
import type { Schedule, Todo } from './calendar/types';
import { formatMonthYear } from './calendar/utils';
import { useCalendarContext } from './calendar/CalendarContext';

const CalendarPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isAddCalendarModalOpen, setIsAddCalendarModalOpen] = useState(false);
    const [isDayScheduleModalOpen, setIsDayScheduleModalOpen] = useState(false);
    const [daySchedules, setDaySchedules] = useState<Schedule[]>([]);
    const [dayTodos, setDayTodos] = useState<Todo[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [direction, setDirection] = useState(0);

    const mainContentRef = useRef<HTMLDivElement>(null);
    const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const sidebarHistoryRef = useRef(false);
    const [calendarHeight, setCalendarHeight] = useState(window.innerHeight - 192);
    const [scrollRatio, setScrollRatio] = useState(0);
    const {
        calendars,
        setCalendars,
        allVisibleSchedules,
        todos,
        selectedDate,
        setSelectedDate,
        toggleCalendarVisibility,
        getSchedulesForDate,
        getTodosForDate,
        toggleTodoComplete,
    } = useCalendarContext();

    const openSidebar = () => {
        setSidebarOpen(true);
        if (!sidebarHistoryRef.current) {
            window.history.pushState({ calendarSidebar: true }, '');
            sidebarHistoryRef.current = true;
        }
    };

    const closeSidebar = () => {
        if (sidebarHistoryRef.current) {
            window.history.back();
            return;
        }

        setSidebarOpen(false);
    };

    const handleDateClick = (date: Date) => {
        const matchSchedules = getSchedulesForDate(date);
        const matchTodos = getTodosForDate(date);
        setSelectedDate(date);

        if (matchSchedules.length > 0 || matchTodos.length > 0) {
            setDaySchedules(matchSchedules);
            setDayTodos(matchTodos);
            setIsDayScheduleModalOpen(true);
            return;
        }

        navigate('/calendar/write');
    };

    const handleEventClick = (schedule: Schedule) => {
        navigate(`/calendar/${schedule.id}`);
    };

    const handleTodoClick = (todo: Todo) => {
        navigate(`/calendar/todo/${todo.id}`);
    };

    const handleDayScheduleSelect = (schedule: Schedule) => {
        setIsDayScheduleModalOpen(false);
        navigate(`/calendar/${schedule.id}`);
    };

    const handleDayTodoSelect = (todo: Todo) => {
        setIsDayScheduleModalOpen(false);
        navigate(`/calendar/todo/${todo.id}`);
    };

    const handleCreateFromDay = (tab: 'schedule' | 'todo') => {
        setIsDayScheduleModalOpen(false);
        if (tab === 'schedule') {
            navigate('/calendar/write');
            return;
        }
        navigate('/calendar/todo/write');
    };

    useEffect(() => {
        const handlePopState = () => {
            if (isSidebarOpen) {
                setSidebarOpen(false);
                sidebarHistoryRef.current = false;
                return;
            }

            if (isDayScheduleModalOpen) {
                setIsDayScheduleModalOpen(false);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [isDayScheduleModalOpen, isSidebarOpen]);

    const handleSwipe = (dir: 'prev' | 'next') => {
        const nextDate = new Date(currentDate);
        nextDate.setMonth(nextDate.getMonth() + (dir === 'next' ? 1 : -1));
        setDirection(dir === 'next' ? 1 : -1);
        setCurrentDate(nextDate);
    };

    const prevMonthDate = useMemo(() => {
        const date = new Date(currentDate);
        date.setMonth(date.getMonth() - 1);
        return date;
    }, [currentDate]);

    const nextMonthDate = useMemo(() => {
        const date = new Date(currentDate);
        date.setMonth(date.getMonth() + 1);
        return date;
    }, [currentDate]);

    const thisWeekSchedules = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + 7);
        endOfWeek.setHours(23, 59, 59, 999);

        return allVisibleSchedules.filter((schedule) => {
            const start = new Date(schedule.start);
            const end = new Date(schedule.end);
            return (start >= today && start <= endOfWeek) || (end >= today && end <= endOfWeek) || (start <= today && end >= endOfWeek);
        }).sort((a, b) => a.start.localeCompare(b.start));
    }, [allVisibleSchedules]);

    const thisWeekTodos = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + 7);

        return todos.filter((todo) => {
            const date = new Date(todo.date);
            return date >= today && date <= endOfWeek;
        }).sort((a, b) => a.date.localeCompare(b.date));
    }, [todos]);

    useEffect(() => {
        const updateHeight = () => {
            if (!mainContentRef.current) return;

            const scrollTop = mainContentRef.current.scrollTop;
            const isDesktop = window.innerWidth >= 768;
            const bottomMenuHeight = isDesktop ? 0 : 64;
            const screenHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
            const listRoom = 64;
            const maxHeight = screenHeight - 64 - bottomMenuHeight - listRoom;
            const threshold = 40;
            const effectiveScroll = scrollTop > threshold ? scrollTop - threshold : 0;
            const ratio = Math.min(1, effectiveScroll / (maxHeight / 1.2));

            setCalendarHeight(Math.max(0, maxHeight - effectiveScroll));
            setScrollRatio(ratio);

            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
            scrollTimeout.current = setTimeout(() => {
                if (!mainContentRef.current) return;

                const currentScrollTop = mainContentRef.current.scrollTop;
                if (currentScrollTop > 0 && currentScrollTop < threshold + maxHeight) {
                    const target = currentScrollTop > (threshold + maxHeight / 4) ? threshold + maxHeight : 0;
                    mainContentRef.current.scrollTo({ top: target, behavior: 'smooth' });
                }
            }, 150);
        };

        const scrollElement = mainContentRef.current;
        if (scrollElement) {
            scrollElement.addEventListener('scroll', updateHeight);
            window.addEventListener('resize', updateHeight);
            updateHeight();
        }

        return () => {
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
            scrollElement?.removeEventListener('scroll', updateHeight);
            window.removeEventListener('resize', updateHeight);
        };
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0f172a] transition-colors">
            <UniversalHeader title="캘린더" onBack={onBack} showBack={false} onMenuClick={openSidebar} />

            <div className="flex flex-1 overflow-hidden h-screen pt-16">
                <CalendarSidebar
                    calendars={calendars}
                    onToggleVisibility={toggleCalendarVisibility}
                    onAddCalendar={() => setIsAddCalendarModalOpen(true)}
                    isOpen={isSidebarOpen}
                    onClose={closeSidebar}
                />

                <main
                    ref={(node) => { mainContentRef.current = node; }}
                    data-fab-scroll-container
                    className="flex-1 overflow-y-auto w-full relative custom-scrollbar"
                >
                    <motion.div
                        className="sticky top-0 z-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/5 overflow-hidden flex flex-col"
                        animate={{ height: calendarHeight }}
                        transition={{ type: 'spring', stiffness: 200, damping: 25, mass: 0.5 }}
                    >
                        <div className="flex items-center justify-between px-6 py-3 bg-white dark:bg-slate-900 flex-shrink-0">
                            <h2 className="text-lg font-black tracking-tight text-slate-800 dark:text-slate-200">
                                {formatMonthYear(currentDate)}
                            </h2>
                            <div className="flex items-center gap-1">
                                <button onClick={() => handleSwipe('prev')} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-teal-500 transition-colors">
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={() => {
                                        const now = new Date();
                                        if (now.getMonth() === currentDate.getMonth() && now.getFullYear() === currentDate.getFullYear()) return;
                                        setDirection(now < currentDate ? -1 : 1);
                                        setCurrentDate(now);
                                    }}
                                    className="p-1.5 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-500/10 rounded-full transition-colors flex items-center justify-center"
                                >
                                    <div className="w-[19px] h-[19px] border-[2px] border-current rounded-[4px] flex items-center justify-center text-[9px] font-black mt-0.5">
                                        {new Date().getDate()}
                                    </div>
                                </button>
                                <button onClick={() => handleSwipe('next')} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-teal-500 transition-colors">
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-hidden relative" style={{ opacity: 1 - scrollRatio * 0.3, transform: `scale(${1 - scrollRatio * 0.02})`, transformOrigin: 'top center' }}>
                            <motion.div
                                key={currentDate.toISOString()}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.6}
                                onDragEnd={(_, info) => {
                                    if (info.offset.x < -30) handleSwipe('next');
                                    else if (info.offset.x > 30) handleSwipe('prev');
                                }}
                                initial={{ x: direction * 100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                className="h-full flex items-stretch w-full cursor-grab active:cursor-grabbing"
                            >
                                <div className="absolute right-full top-0 bottom-0 w-full px-2 opacity-20">
                                    <CustomCalendarView date={prevMonthDate} schedules={allVisibleSchedules} todos={[]} calendars={calendars} onDateClick={() => { }} onEventClick={() => { }} onTodoClick={() => { }} />
                                </div>
                                <div className="w-full h-full flex-shrink-0">
                                    <CustomCalendarView date={currentDate} schedules={allVisibleSchedules} todos={todos} calendars={calendars} onDateClick={handleDateClick} onEventClick={handleEventClick} onTodoClick={handleTodoClick} />
                                </div>
                                <div className="absolute left-full top-0 bottom-0 w-full px-2 opacity-20">
                                    <CustomCalendarView date={nextMonthDate} schedules={allVisibleSchedules} todos={[]} calendars={calendars} onDateClick={() => { }} onEventClick={() => { }} onTodoClick={() => { }} />
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    <div className="flex-1 p-5 space-y-6 pb-32" style={{ minHeight: 'calc(100vh - 64px)' }}>
                        <div>
                            <h3 className="text-base font-black tracking-tight flex items-center gap-2 mb-3">
                                <span className="w-1 h-5 bg-teal-500 rounded-full" />
                                다가오는 일정
                            </h3>
                            {thisWeekSchedules.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-slate-300 dark:text-slate-600">
                                    <CalendarIcon size={28} className="mb-3" />
                                    <p className="text-sm font-semibold">일정이 없습니다</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {thisWeekSchedules.map((schedule) => {
                                        const calendar = calendars.find((item) => item.id === schedule.calendarId);
                                        const start = new Date(schedule.start);
                                        const isToday = start.toDateString() === new Date().toDateString();

                                        return (
                                            <motion.button
                                                layout
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                key={schedule.id}
                                                onClick={() => handleEventClick(schedule)}
                                                className="w-full text-left bg-white dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-teal-400/50 transition-all flex items-center gap-3 p-3 group"
                                            >
                                                <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-xl flex-shrink-0">
                                                    <span className={`text-[10px] font-bold ${isToday ? 'text-teal-500' : 'text-slate-400'}`}>
                                                        {start.toLocaleDateString('ko-KR', { weekday: 'short' })}
                                                    </span>
                                                    <span className={`text-lg font-black leading-none ${isToday ? 'text-teal-500' : 'text-slate-800 dark:text-white'}`}>
                                                        {start.getDate()}
                                                    </span>
                                                </div>
                                                <div className="w-0.5 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: calendar?.color }} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-sm text-slate-900 dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-400">{schedule.title}</p>
                                                    <div className="flex gap-2 text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                                                        <span className="flex items-center gap-0.5">
                                                            <Clock size={11} />
                                                            {schedule.allDay ? '종일' : start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                                        </span>
                                                        {schedule.location && <span className="flex items-center gap-0.5 truncate"><MapPin size={11} />{schedule.location}</span>}
                                                    </div>
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-base font-black tracking-tight flex items-center gap-2">
                                    <span className="w-1 h-5 bg-violet-500 rounded-full" />
                                    이번 주 할 일
                                </h3>
                                <button
                                    onClick={() => {
                                        setSelectedDate(new Date());
                                        navigate('/calendar/todo/write');
                                    }}
                                    className="p-1.5 hover:bg-violet-50 dark:hover:bg-violet-500/10 rounded-full text-slate-400 hover:text-violet-500 transition-colors"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                            {thisWeekTodos.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-slate-300 dark:text-slate-600">
                                    <CheckSquare size={28} className="mb-3" />
                                    <p className="text-sm font-semibold">할 일이 없습니다</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {thisWeekTodos.map((todo) => {
                                        const todoDate = new Date(todo.date + 'T00:00:00');
                                        const isToday = todoDate.toDateString() === new Date().toDateString();

                                        return (
                                            <motion.div
                                                layout
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                key={todo.id}
                                                className={`bg-white dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-white/5 transition-all flex items-center gap-3 p-3 ${todo.completed ? 'opacity-60' : ''}`}
                                            >
                                                <button
                                                    onClick={() => handleToggleTodoComplete(todo.id)}
                                                    className={`w-6 h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center transition-colors ${todo.completed ? 'bg-violet-500 border-violet-500' : 'border-slate-300 dark:border-slate-600 hover:border-violet-400'}`}
                                                >
                                                    {todo.completed && <Check size={12} className="text-white" strokeWidth={3} />}
                                                </button>
                                                <button onClick={() => handleTodoClick(todo)} className="flex-1 min-w-0 flex items-center gap-3 text-left">
                                                    <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-xl flex-shrink-0">
                                                        <span className={`text-[10px] font-bold ${isToday ? 'text-violet-500' : 'text-slate-400'}`}>
                                                            {todoDate.toLocaleDateString('ko-KR', { weekday: 'short' })}
                                                        </span>
                                                        <span className={`text-lg font-black leading-none ${isToday ? 'text-violet-500' : 'text-slate-800 dark:text-white'}`}>
                                                            {todoDate.getDate()}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`font-bold text-sm truncate ${todo.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>{todo.title}</p>
                                                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-0.5">
                                                            <Clock size={11} />
                                                            {todo.allDay ? '하루종일' : todo.time || ''}
                                                        </p>
                                                    </div>
                                                </button>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            <AnimatePresence>
                {isDayScheduleModalOpen && selectedDate && (
                    <DayScheduleModal
                        date={selectedDate}
                        schedules={daySchedules}
                        todos={dayTodos}
                        calendars={calendars}
                        onClose={() => setIsDayScheduleModalOpen(false)}
                        onSelectSchedule={handleDayScheduleSelect}
                        onSelectTodo={handleDayTodoSelect}
                        onToggleTodo={toggleTodoComplete}
                        onCreateSchedule={() => handleCreateFromDay('schedule')}
                        onCreateTodo={() => handleCreateFromDay('todo')}
                    />
                )}
                {isAddCalendarModalOpen && (
                    <AddCalendarModal
                        onClose={() => setIsAddCalendarModalOpen(false)}
                        onSave={(newCalendar) => {
                            setCalendars((prev) => [...prev, { ...newCalendar, id: Math.random().toString(), isVisible: true }]);
                            setIsAddCalendarModalOpen(false);
                        }}
                    />
                )}
            </AnimatePresence>

            <ScrollAwareFab
                onClick={() => {
                    setSelectedDate(new Date());
                    navigate('/calendar/write');
                }}
                ariaLabel="일정 추가"
            >
                <Plus size={28} />
            </ScrollAwareFab>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
            `}</style>
        </div>
    );
};

export default CalendarPage;
