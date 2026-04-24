import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Calendar as CalendarIcon,
    Check,
    CheckSquare,
    Clock,
    MapPin,
    Plus,
    Search,
    X,
} from 'lucide-react';
import CalendarSidebar, { CalendarCategory } from '../calendar/CalendarSidebar';
import ScrollAwareFab from '../common/ScrollAwareFab';
import UniversalHeader from '../layout/UniversalHeader';
import AddCalendarModal from './calendar/AddCalendarModal';
import CustomCalendarView from './calendar/CustomCalendarView';
import DayScheduleModal from './calendar/DayScheduleModal';
import RegisterPage from './calendar/RegisterPage';
import ScheduleDetailPage from './calendar/ScheduleDetailPage';
import TodoDetailPage from './calendar/TodoDetailPage';
import type { Schedule, Todo } from './calendar/types';
import { formatMonthYear } from './calendar/utils';
import { useCalendarContext } from './calendar/CalendarContext';

const CalendarPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isAddCalendarModalOpen, setIsAddCalendarModalOpen] = useState(false);
    const [isDayScheduleModalOpen, setIsDayScheduleModalOpen] = useState(false);
    const [daySchedules, setDaySchedules] = useState<Schedule[]>([]);
    const [dayTodos, setDayTodos] = useState<Todo[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [direction, setDirection] = useState(0);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [pressedHeaderAction, setPressedHeaderAction] = useState<'search' | 'today' | null>(null);

    const mainContentRef = useRef<HTMLDivElement>(null);
    const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const headerActionReleaseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastHeaderActionRef = useRef<{ action: 'search' | 'today' | null; time: number }>({ action: null, time: 0 });
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
        findSchedule,
        findTodo,
        saveSchedule,
        saveTodo,
        deleteSchedule,
        deleteTodo,
        activePanel,
        openPanel,
        closePanel,
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

        openPanel({ type: 'schedule-form' });
    };

    const handleEventClick = (schedule: Schedule) => {
        openPanel({ type: 'schedule-detail', id: schedule.id });
    };

    const handleTodoClick = (todo: Todo) => {
        openPanel({ type: 'todo-detail', id: todo.id });
    };

    const handleDayScheduleSelect = (schedule: Schedule) => {
        setIsDayScheduleModalOpen(false);
        openPanel({ type: 'schedule-detail', id: schedule.id });
    };

    const handleDayTodoSelect = (todo: Todo) => {
        setIsDayScheduleModalOpen(false);
        openPanel({ type: 'todo-detail', id: todo.id });
    };

    const handleCreateFromDay = (tab: 'schedule' | 'todo') => {
        setIsDayScheduleModalOpen(false);
        openPanel(tab === 'schedule' ? { type: 'schedule-form' } : { type: 'todo-form' });
    };

    useEffect(() => {
        const handlePopState = () => {
            if (activePanel.type !== 'none') {
                closePanel();
                return;
            }

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
    }, [activePanel, isDayScheduleModalOpen, isSidebarOpen]);

    useEffect(() => {
        if (activePanel.type !== 'none') {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [activePanel.type]);

    useEffect(() => {
        return () => {
            if (headerActionReleaseTimeout.current) clearTimeout(headerActionReleaseTimeout.current);
        };
    }, []);

    const handleSwipe = (dir: 'prev' | 'next') => {
        const nextDate = new Date(currentDate);
        nextDate.setMonth(nextDate.getMonth() + (dir === 'next' ? 1 : -1));
        setDirection(dir === 'next' ? 1 : -1);
        setCurrentDate(nextDate);
    };

    const moveToToday = () => {
        const now = new Date();
        if (now.getMonth() === currentDate.getMonth() && now.getFullYear() === currentDate.getFullYear()) return;
        setDirection(now < currentDate ? -1 : 1);
        setCurrentDate(now);
    };

    const pressHeaderAction = (action: 'search' | 'today') => {
        if (headerActionReleaseTimeout.current) clearTimeout(headerActionReleaseTimeout.current);
        setPressedHeaderAction(action);
    };

    const releaseHeaderAction = () => {
        if (headerActionReleaseTimeout.current) clearTimeout(headerActionReleaseTimeout.current);
        headerActionReleaseTimeout.current = setTimeout(() => {
            setPressedHeaderAction(null);
            headerActionReleaseTimeout.current = null;
        }, 180);
    };

    const shouldSkipHeaderClick = (action: 'search' | 'today') => {
        const now = Date.now();
        return lastHeaderActionRef.current.action === action && now - lastHeaderActionRef.current.time < 400;
    };

    const markHeaderActionTriggered = (action: 'search' | 'today') => {
        lastHeaderActionRef.current = { action, time: Date.now() };
    };

    const toggleSearch = () => {
        setIsSearchOpen((prev) => !prev);
        setSearchQuery('');
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

    const normalizedSearchQuery = searchQuery.trim().toLowerCase();

    const filteredWeekSchedules = useMemo(() => {
        if (!normalizedSearchQuery) return thisWeekSchedules;

        return thisWeekSchedules.filter((schedule) => {
            const haystack = [schedule.title, schedule.description, schedule.location].filter(Boolean).join(' ').toLowerCase();
            return haystack.includes(normalizedSearchQuery);
        });
    }, [normalizedSearchQuery, thisWeekSchedules]);

    const filteredWeekTodos = useMemo(() => {
        if (!normalizedSearchQuery) return thisWeekTodos;

        return thisWeekTodos.filter((todo) => {
            const haystack = [todo.title, todo.memo, todo.time].filter(Boolean).join(' ').toLowerCase();
            return haystack.includes(normalizedSearchQuery);
        });
    }, [normalizedSearchQuery, thisWeekTodos]);

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
            <UniversalHeader
                title="캘린더"
                onBack={onBack}
                showBack={false}
                onMenuClick={openSidebar}
                rightAction={
                    <>
                        <button
                            onPointerDown={() => pressHeaderAction('search')}
                            onPointerUp={(event) => {
                                markHeaderActionTriggered('search');
                                toggleSearch();
                                event.currentTarget.blur();
                                releaseHeaderAction();
                            }}
                            onPointerCancel={releaseHeaderAction}
                            onPointerLeave={releaseHeaderAction}
                            onClick={() => {
                                if (shouldSkipHeaderClick('search')) return;
                                toggleSearch();
                            }}
                            className={`calendar-header-action p-2 rounded-full text-slate-500 dark:text-gray-400 transition-colors duration-200 ease-out ${pressedHeaderAction === 'search' ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800' : ''}`}
                            aria-label={isSearchOpen ? '검색 닫기' : '검색'}
                        >
                            {isSearchOpen ? <X size={20} /> : <Search size={20} />}
                        </button>
                        <button
                            onPointerDown={() => pressHeaderAction('today')}
                            onPointerUp={(event) => {
                                markHeaderActionTriggered('today');
                                moveToToday();
                                event.currentTarget.blur();
                                releaseHeaderAction();
                            }}
                            onPointerCancel={releaseHeaderAction}
                            onPointerLeave={releaseHeaderAction}
                            onClick={(event) => {
                                if (shouldSkipHeaderClick('today')) return;
                                moveToToday();
                                event.currentTarget.blur();
                            }}
                            className={`calendar-header-action p-2 rounded-full text-slate-500 dark:text-gray-400 focus:outline-none focus-visible:outline-none focus-visible:ring-0 transition-colors duration-200 ease-out ${pressedHeaderAction === 'today' ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800' : ''}`}
                            style={{ WebkitTapHighlightColor: 'transparent' }}
                            aria-label="오늘로 이동"
                        >
                            <div className="w-[20px] h-[20px] border-[2px] border-current rounded-[5px] flex items-center justify-center text-[9px] font-black leading-none pt-px">
                                {new Date().getDate()}
                            </div>
                        </button>
                    </>
                }
            />

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
                    <AnimatePresence initial={false}>
                        {isSearchOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2, ease: 'easeInOut' }}
                                className="sticky top-0 z-30 overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/5"
                            >
                                <div className="px-6 py-3 flex items-center gap-2">
                                    <Search size={16} className="text-slate-400 flex-shrink-0" />
                                    <input
                                        autoFocus
                                        type="text"
                                        value={searchQuery}
                                        onChange={(event) => setSearchQuery(event.target.value)}
                                        placeholder="일정, 할 일 검색"
                                        className="flex-1 bg-transparent text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                            aria-label="검색어 지우기"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div
                        className="sticky top-0 z-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/5 overflow-hidden flex flex-col"
                        animate={{ height: calendarHeight }}
                        transition={{ type: 'spring', stiffness: 200, damping: 25, mass: 0.5 }}
                    >
                        <div className="flex items-center justify-between px-6 py-3 bg-white dark:bg-slate-900 flex-shrink-0">
                            <h2 className="text-lg font-black tracking-tight text-slate-800 dark:text-slate-200">
                                {formatMonthYear(currentDate)}
                            </h2>
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
                            {filteredWeekSchedules.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-slate-300 dark:text-slate-600">
                                    <CalendarIcon size={28} className="mb-3" />
                                    <p className="text-sm font-semibold">{normalizedSearchQuery ? '검색 결과가 없습니다' : '일정이 없습니다'}</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {filteredWeekSchedules.map((schedule) => {
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
                                        openPanel({ type: 'todo-form' });
                                    }}
                                    className="p-1.5 hover:bg-violet-50 dark:hover:bg-violet-500/10 rounded-full text-slate-400 hover:text-violet-500 transition-colors"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                            {filteredWeekTodos.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-slate-300 dark:text-slate-600">
                                    <CheckSquare size={28} className="mb-3" />
                                    <p className="text-sm font-semibold">{normalizedSearchQuery ? '검색 결과가 없습니다' : '할 일이 없습니다'}</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {filteredWeekTodos.map((todo) => {
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
                                                    onClick={() => toggleTodoComplete(todo.id)}
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

            <AnimatePresence>
                {activePanel.type !== 'none' && (
                    <motion.div
                        key={activePanel.type + (('id' in activePanel && activePanel.id) ? `-${activePanel.id}` : '')}
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                        className="fixed inset-0 z-[60] flex flex-col bg-slate-50 dark:bg-[#0f172a]"
                    >
                        {activePanel.type === 'schedule-detail' && (() => {
                            const schedule = findSchedule(activePanel.id);
                            if (!schedule) return null;
                            return (
                                <ScheduleDetailPage
                                    schedule={schedule}
                                    calendars={calendars}
                                    onBack={closePanel}
                                    onEdit={() => openPanel({ type: 'schedule-form', id: schedule.id })}
                                    onDelete={(id) => { deleteSchedule(id); closePanel(); }}
                                />
                            );
                        })()}
                        {activePanel.type === 'schedule-form' && (
                            <RegisterPage
                                selectedDate={(() => {
                                    if (activePanel.id) {
                                        const s = findSchedule(activePanel.id);
                                        return s ? new Date(s.start) : selectedDate || new Date();
                                    }
                                    return selectedDate || new Date();
                                })()}
                                editingSchedule={activePanel.id ? findSchedule(activePanel.id) : null}
                                editingTodo={null}
                                calendars={calendars}
                                initialTab="schedule"
                                onCancel={() => {
                                    if (activePanel.id) {
                                        openPanel({ type: 'schedule-detail', id: activePanel.id });
                                    } else {
                                        closePanel();
                                    }
                                }}
                                onSaveSchedule={(data) => { saveSchedule(data, activePanel.id); closePanel(); }}
                                onSaveTodo={(data) => { saveTodo(data); closePanel(); }}
                            />
                        )}
                        {activePanel.type === 'todo-detail' && (() => {
                            const todo = findTodo(activePanel.id);
                            if (!todo) return null;
                            return (
                                <TodoDetailPage
                                    todo={todo}
                                    onBack={closePanel}
                                    onEdit={() => openPanel({ type: 'todo-form', id: todo.id })}
                                    onDelete={(id) => { deleteTodo(id); closePanel(); }}
                                    onToggleComplete={toggleTodoComplete}
                                />
                            );
                        })()}
                        {activePanel.type === 'todo-form' && (
                            <RegisterPage
                                selectedDate={(() => {
                                    if (activePanel.id) {
                                        const t = findTodo(activePanel.id);
                                        return t ? new Date(`${t.date}T00:00:00`) : selectedDate || new Date();
                                    }
                                    return selectedDate || new Date();
                                })()}
                                editingSchedule={null}
                                editingTodo={activePanel.id ? findTodo(activePanel.id) : null}
                                calendars={calendars}
                                initialTab="todo"
                                onCancel={() => {
                                    if (activePanel.id) {
                                        openPanel({ type: 'todo-detail', id: activePanel.id });
                                    } else {
                                        closePanel();
                                    }
                                }}
                                onSaveSchedule={(data) => { saveSchedule(data); closePanel(); }}
                                onSaveTodo={(data) => { saveTodo(data, activePanel.id); closePanel(); }}
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <ScrollAwareFab
                onClick={() => {
                    setSelectedDate(new Date());
                    openPanel({ type: 'schedule-form' });
                }}
                ariaLabel="일정 추가"
            >
                <Plus size={28} />
            </ScrollAwareFab>

            <style>{`
                .calendar-header-action {
                    -webkit-tap-highlight-color: transparent;
                    touch-action: manipulation;
                }

                @media (hover: hover) and (pointer: fine) {
                    .calendar-header-action:hover {
                        color: rgb(15 23 42);
                        background: rgb(241 245 249);
                    }

                    .dark .calendar-header-action:hover {
                        color: rgb(255 255 255);
                        background: rgb(30 41 59);
                    }
                }

                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
            `}</style>
        </div>
    );
};

export default CalendarPage;
