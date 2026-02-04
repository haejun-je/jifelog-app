
import React, { useState, useRef, useEffect, useMemo } from 'react';
import UniversalHeader from '../layout/UniversalHeader';
import CalendarSidebar, { CalendarCategory } from '../calendar/CalendarSidebar';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Clock, MapPin, AlignLeft, Plus, X, Check, Trash, Calendar as CalendarIcon } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';


// --- Types ---
interface Schedule {
    id: string;
    title: string;
    start: string; // ISO String or YYYY-MM-DD
    end: string;
    allDay: boolean;
    calendarId: string;
    description?: string;
    location?: string;
}

// --- Helper Functions ---
const getDaysInMonth = (year: number, month: number) => {
    const date = new Date(year, month, 1);
    const days = [];

    // Previous month padding
    const firstDay = date.getDay();
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
        days.push({
            day: prevMonthLastDay - i,
            month: month - 1,
            year: year,
            isCurrentMonth: false
        });
    }

    // Current month days
    const lastDay = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= lastDay; i++) {
        days.push({
            day: i,
            month: month,
            year: year,
            isCurrentMonth: true
        });
    }

    // Next month padding (to fill 6 weeks)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
        days.push({
            day: i,
            month: month + 1,
            year: year,
            isCurrentMonth: false
        });
    }

    return days;
};

const formatDate = (date: Date) => {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
};

// --- Custom Calendar View Component ---
const CustomCalendarView: React.FC<{
    date: Date;
    schedules: Schedule[];
    calendars: CalendarCategory[];
    onDateClick: (date: Date) => void;
    onEventClick: (schedule: Schedule) => void;
}> = ({ date, schedules, calendars, onDateClick, onEventClick }) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = useMemo(() => getDaysInMonth(year, month), [year, month]);
    const today = new Date();

    // Assign lanes to schedules to prevent overlap
    const scheduleLanes = useMemo(() => {
        const slots: string[][] = Array(42).fill(0).map(() => []);
        // Pick visible and sorted schedules (all-day first, then longer ones)
        const sortedSchedules = [...schedules]
            .filter(s => calendars.find(c => c.id === s.calendarId)?.isVisible)
            .sort((a, b) => {
                if (a.allDay !== b.allDay) return a.allDay ? -1 : 1;
                const aDuration = new Date(a.end).getTime() - new Date(a.start).getTime();
                const bDuration = new Date(b.end).getTime() - new Date(b.start).getTime();
                return bDuration - aDuration;
            });

        const assigned: { [id: string]: number } = {};

        sortedSchedules.forEach(s => {
            const sStart = new Date(s.start);
            const sEnd = new Date(s.end);
            sStart.setHours(0, 0, 0, 0);
            sEnd.setHours(0, 0, 0, 0);

            let firstIdx = -1;
            let lastIdx = -1;

            days.forEach((d, i) => {
                const cellDate = new Date(d.year, d.month, d.day);
                if (cellDate >= sStart && cellDate <= sEnd) {
                    if (firstIdx === -1) firstIdx = i;
                    lastIdx = i;
                }
            });

            if (firstIdx !== -1) {
                let lane = 0;
                while (true) {
                    let clear = true;
                    for (let i = firstIdx; i <= lastIdx; i++) {
                        if (slots[i][lane]) {
                            clear = false;
                            break;
                        }
                    }
                    if (clear) {
                        for (let i = firstIdx; i <= lastIdx; i++) slots[i][lane] = s.id;
                        assigned[s.id] = lane;
                        break;
                    }
                    lane++;
                }
            }
        });

        return assigned;
    }, [days, schedules, calendars]);

    return (
        <div className="flex flex-col h-full select-none">
            {/* Week Header */}
            <div className="grid grid-cols-7 border-b border-slate-100 dark:border-white/5">
                {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
                    <div key={d} className={`text-[10px] text-center font-black py-2 uppercase tracking-tight ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-slate-400'}`}>
                        {d}
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 flex-1">
                {days.map((d, i) => {
                    const cellDate = new Date(d.year, d.month, d.day);
                    const isToday = today.toDateString() === cellDate.toDateString();

                    // Calculate lanes for this cell
                    const dayLanes: (Schedule | null)[] = [];
                    schedules.forEach(s => {
                        const lane = scheduleLanes[s.id];
                        if (lane !== undefined) {
                            const sStart = new Date(s.start);
                            const sEnd = new Date(s.end);
                            sStart.setHours(0, 0, 0, 0);
                            sEnd.setHours(0, 0, 0, 0);
                            if (cellDate >= sStart && cellDate <= sEnd) {
                                dayLanes[lane] = s;
                            }
                        }
                    });

                    return (
                        <div
                            key={`${d.year}-${d.month}-${d.day}-${i}`}
                            onClick={() => onDateClick(cellDate)}
                            className={`border-r border-b border-slate-50 dark:border-white/5 pt-0.5 pb-1 min-h-0 flex flex-col transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/20 cursor-pointer ${!d.isCurrentMonth ? 'opacity-30' : ''}`}
                        >
                            <span className={`text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full ml-auto mb-0.5 mr-1 ${isToday ? 'bg-teal-500 text-white' : 'text-slate-400'}`}>
                                {d.day}
                            </span>
                            <div className="flex flex-col gap-0.5">
                                {Array.from({ length: Math.max(3, Math.min(dayLanes.length, 4)) }).map((_, laneIdx) => {
                                    const s = dayLanes[laneIdx];
                                    if (!s) return <div key={laneIdx} className="h-4" />;

                                    const cal = calendars.find(c => c.id === s.calendarId);
                                    const sStart = new Date(s.start);
                                    const sEnd = new Date(s.end);
                                    sStart.setHours(0, 0, 0, 0);
                                    sEnd.setHours(0, 0, 0, 0);

                                    const isStart = sStart.getTime() === cellDate.getTime();
                                    const isEnd = sEnd.getTime() === cellDate.getTime();
                                    const isMultiDay = sStart.getTime() !== sEnd.getTime();
                                    const isWeekStart = i % 7 === 0;

                                    if (s.allDay || isMultiDay) {
                                        const showTitle = isStart || isWeekStart;
                                        return (
                                            <div
                                                key={s.id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEventClick(s);
                                                }}
                                                className={`h-4 text-[9px] py-0.5 truncate text-white font-bold opacity-90 transition-transform active:scale-95 relative ${!isEnd ? 'w-[calc(100%+1px)] z-10' : 'w-full'} ${isStart ? 'rounded-l-[5px]' : ''} ${isEnd ? 'rounded-r-[5px]' : ''} ${showTitle ? 'px-1.5' : 'px-0'}`}
                                                style={{ backgroundColor: cal?.color || '#ccc' }}
                                            >
                                                {showTitle && s.title}
                                            </div>
                                        );
                                    }

                                    const barColor = cal?.color || '#ccc';
                                    return (
                                        <div
                                            key={s.id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEventClick(s);
                                            }}
                                            className="h-4 flex items-center gap-1 text-[9px] font-bold text-slate-700 dark:text-slate-300 transition-transform active:scale-95"
                                        >
                                            <div className="w-0.5 h-3 flex-shrink-0" style={{ backgroundColor: barColor }} />
                                            <span className="truncate">{s.title}</span>
                                        </div>
                                    );
                                })}
                                {dayLanes.length > 4 && (
                                    <div className="h-4 text-[9px] font-bold text-slate-400 dark:text-slate-500 flex items-center pl-1">
                                        ...
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- Main Page Component ---
const CalendarPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [calendars, setCalendars] = useState<CalendarCategory[]>([
        { id: 'my', name: '나의 캘린더', color: '#10b981', isVisible: true },
        { id: 'concert', name: '콘서트', color: '#8b5cf6', isVisible: true },
        { id: 'company', name: '회사', color: '#3b82f6', isVisible: true },
    ]);
    const [schedules, setSchedules] = useState<Schedule[]>([
        { id: '1', title: '팀 회의', start: '2026-01-23T14:00:00', end: '2026-01-23T15:30:00', allDay: false, calendarId: 'company', description: '주간 업무 보고' },
        { id: '2', title: '저녁 약속', start: '2026-01-23T19:00:00', end: '2026-01-23T21:00:00', allDay: false, calendarId: 'my' },
        { id: '3', title: '아이유 콘서트', start: '2026-01-24T18:00:00', end: '2026-01-24T22:00:00', allDay: false, calendarId: 'concert', location: 'KSPO 돔' },
        { id: '4', title: '설날 연휴', start: '2026-01-28', end: '2026-01-31', allDay: true, calendarId: 'my' },
        { id: '5', title: '프로젝트 런칭', start: '2026-01-18T10:00:00', end: '2026-01-20T12:00:00', allDay: true, calendarId: 'company' },
    ]);

    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [isAddCalendarModalOpen, setIsAddCalendarModalOpen] = useState(false);
    const [isDayScheduleModalOpen, setIsDayScheduleModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
    const [daySchedules, setDaySchedules] = useState<Schedule[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [direction, setDirection] = useState(0);

    const mainContentRef = useRef<HTMLDivElement>(null);
    const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
    const sidebarHistoryRef = useRef(false);

    // Scroll interpolation states
    const [calendarHeight, setCalendarHeight] = useState(window.innerHeight - 192); // Adjusted for listRoom 64 (64+64+64)
    const [scrollRatio, setScrollRatio] = useState(0);

    const toggleCalendarVisibility = (id: string) => {
        setCalendars(prev => prev.map(c => c.id === id ? { ...c, isVisible: !c.isVisible } : c));
    };

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
        } else {
            setSidebarOpen(false);
        }
    };

    const getSchedulesForDate = (date: Date) => {
        const target = new Date(date);
        target.setHours(0, 0, 0, 0);

        return allVisibleSchedules
            .filter(s => {
                const start = new Date(s.start);
                const end = new Date(s.end);
                start.setHours(0, 0, 0, 0);
                end.setHours(0, 0, 0, 0);
                return target >= start && target <= end;
            })
            .sort((a, b) => a.start.localeCompare(b.start));
    };

    const handleDateClick = (date: Date) => {
        const matches = getSchedulesForDate(date);

        setSelectedDate(date);
        setEditingSchedule(null);
        if (matches.length > 0) {
            setDaySchedules(matches);
            setIsDayScheduleModalOpen(true);
            window.history.pushState({ dayScheduleModal: true }, '');
        } else {
            setIsScheduleModalOpen(true);
        }
    };

    const handleEventClick = (schedule: Schedule) => {
        const eventDate = new Date(schedule.start);
        const matches = getSchedulesForDate(eventDate);

        setSelectedDate(eventDate);
        setEditingSchedule(null);
        setDaySchedules(matches);
        setIsDayScheduleModalOpen(true);
        window.history.pushState({ dayScheduleModal: true }, '');
    };

    const handleDayScheduleSelect = (schedule: Schedule) => {
        setEditingSchedule(schedule);
        setIsDayScheduleModalOpen(false);
        setIsScheduleModalOpen(true);
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
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [isDayScheduleModalOpen, isSidebarOpen]);

    const handleSwipe = (dir: 'prev' | 'next') => {
        const newDate = new Date(currentDate);
        if (dir === 'prev') {
            newDate.setMonth(newDate.getMonth() - 1);
            setDirection(-1);
        } else {
            newDate.setMonth(newDate.getMonth() + 1);
            setDirection(1);
        }
        setCurrentDate(newDate);
    };



    const prevMonthDate = useMemo(() => {
        const d = new Date(currentDate);
        d.setMonth(d.getMonth() - 1);
        return d;
    }, [currentDate]);

    const nextMonthDate = useMemo(() => {
        const d = new Date(currentDate);
        d.setMonth(d.getMonth() + 1);
        return d;
    }, [currentDate]);

    const allVisibleSchedules = useMemo(() => {
        const visibleCalendarIds = calendars.filter(c => c.isVisible).map(c => c.id);
        return schedules.filter(s => visibleCalendarIds.includes(s.calendarId));
    }, [schedules, calendars]);

    const thisWeekSchedules = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + 7);
        endOfWeek.setHours(23, 59, 59, 999);

        return allVisibleSchedules.filter(s => {
            const start = new Date(s.start);
            const end = new Date(s.end);
            return (start >= today && start <= endOfWeek) || (end >= today && end <= endOfWeek) || (start <= today && end >= endOfWeek);
        }).sort((a, b) => a.start.localeCompare(b.start));
    }, [allVisibleSchedules]);

    // Handle Scroll for shrinking calendar
    useEffect(() => {
        const updateH = () => {
            if (!mainContentRef.current) return;
            const scrollTop = mainContentRef.current.scrollTop;
            const isDesktop = window.innerWidth >= 768;
            const bottomMenuH = isDesktop ? 0 : 64;
            const headerH = 64;
            const screenH = window.visualViewport ? window.visualViewport.height : window.innerHeight;

            const listRoom = 64; // Adjusted to show only the title row
            const maxH = screenH - headerH - bottomMenuH - listRoom;
            const minH = 0; // Changed from 160 to 0 to completely hide
            const maxScroll = maxH; // Entire height can be scrolled away

            const threshold = 40; // Slightly reduced threshold
            let effectiveScroll = 0;
            if (scrollTop > threshold) effectiveScroll = scrollTop - threshold;

            const ratio = Math.min(1, effectiveScroll / (maxScroll / 1.2));
            const newHeight = Math.max(minH, maxH - effectiveScroll);

            setCalendarHeight(newHeight);
            setScrollRatio(ratio);

            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
            scrollTimeout.current = setTimeout(() => {
                if (!mainContentRef.current) return;
                const curScroll = mainContentRef.current.scrollTop;
                if (curScroll > 0 && curScroll < threshold + maxScroll) {
                    const targetScroll = curScroll > (threshold + maxScroll / 4) ? threshold + maxScroll : 0;
                    mainContentRef.current.scrollTo({ top: targetScroll, behavior: 'smooth' });
                }
            }, 150);
        };

        const div = mainContentRef.current;
        if (div) {
            div.addEventListener('scroll', updateH);
            window.addEventListener('resize', updateH);
            updateH();
        }
        return () => {
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
            div?.removeEventListener('scroll', updateH);
            window.removeEventListener('resize', updateH);
        };
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0f172a] transition-colors">
            {/* Fixed Header */}
            <UniversalHeader
                title="캘린더"
                onBack={onBack}
                showBack={false}
                onMenuClick={openSidebar}
            />

            {/* Content Wrapper */}
            <div className="flex flex-1 overflow-hidden h-[calc(100vh-64px)]">
                <CalendarSidebar
                    calendars={calendars}
                    onToggleVisibility={toggleCalendarVisibility}
                    onAddCalendar={() => setIsAddCalendarModalOpen(true)}
                    isOpen={isSidebarOpen}
                    onClose={closeSidebar}
                />

                {/* Main Content */}
                <main ref={mainContentRef} className="flex-1 overflow-y-auto w-full relative md:ml-64 custom-scrollbar">
                    <motion.div
                        className="sticky top-0 z-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/5 overflow-hidden flex-shrink-0 flex flex-col"
                        animate={{ height: calendarHeight }}
                        transition={{ type: "spring", stiffness: 200, damping: 25, mass: 0.5 }}
                    >
                        {/* Custom Header Toolbar */}
                        <div className="flex items-center justify-between px-6 py-3 bg-white dark:bg-slate-900 flex-shrink-0">
                            <h2 className="text-lg font-black tracking-tight text-slate-800 dark:text-slate-200">
                                {formatDate(currentDate)}
                            </h2>
                            <div className="flex items-center gap-2">
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
                                    title="오늘로 이동"
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

                        {/* Carousel Wrapper */}
                        <div
                            className="flex-1 overflow-hidden relative"
                            style={{
                                opacity: 1 - (scrollRatio * 0.3),
                                transform: `scale(${1 - scrollRatio * 0.02})`,
                                transformOrigin: 'top center'
                            }}
                        >
                            <motion.div
                                key={currentDate.toISOString()}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.6}
                                onDragEnd={(_, info) => {
                                    const threshold = 100;
                                    if (info.offset.x < -threshold) handleSwipe('next');
                                    else if (info.offset.x > threshold) handleSwipe('prev');
                                }}
                                initial={{ x: direction * 100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="h-full flex items-stretch w-full cursor-grab active:cursor-grabbing"
                            >
                                <div className="absolute right-full top-0 bottom-0 w-full px-2 opacity-20">
                                    <CustomCalendarView date={prevMonthDate} schedules={allVisibleSchedules} calendars={calendars} onDateClick={() => { }} onEventClick={() => { }} />
                                </div>
                                <div className="w-full h-full px-2 flex-shrink-0">
                                    <CustomCalendarView date={currentDate} schedules={allVisibleSchedules} calendars={calendars} onDateClick={handleDateClick} onEventClick={handleEventClick} />
                                </div>
                                <div className="absolute left-full top-0 bottom-0 w-full px-2 opacity-20">
                                    <CustomCalendarView date={nextMonthDate} schedules={allVisibleSchedules} calendars={calendars} onDateClick={() => { }} onEventClick={() => { }} />
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Schedule List */}
                    <div
                        className="flex-1 p-5 space-y-6 pb-32"
                        style={{ minHeight: 'calc(100vh - 64px)' }}
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-teal-500 rounded-full" />
                                다가오는 일정
                            </h3>


                        </div>

                        {thisWeekSchedules.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-400 text-center">
                                <CalendarIcon size={32} className="opacity-20 mb-4" />
                                <p className="font-bold">표시할 일정이 없습니다.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {thisWeekSchedules.map(s => {
                                    const cal = calendars.find(c => c.id === s.calendarId);
                                    const start = new Date(s.start);
                                    const isToday = start.toDateString() === new Date().toDateString();
                                    return (
                                        <motion.button
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            key={s.id}
                                            onClick={() => handleEventClick(s)}
                                            className="w-full text-left bg-white dark:bg-slate-800/40 p-2 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-teal-500/50 transition-all flex items-center gap-4 group"
                                        >
                                            <div className="flex flex-col items-center justify-center min-w-[50px] py-1 bg-slate-50 dark:bg-slate-900 rounded-xl">
                                                <span className={`text-[10px] font-bold ${isToday ? 'text-teal-500' : 'text-slate-400 uppercase'}`}>{start.toLocaleDateString('ko-KR', { weekday: 'short' })}</span>
                                                <span className={`text-lg font-black ${isToday ? 'text-teal-500' : 'text-slate-900 dark:text-white'}`}>{start.getDate()}</span>
                                            </div>
                                            <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: cal?.color }} />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-slate-900 dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-400">{s.title}</h4>
                                                <div className="flex gap-x-3 text-xs text-slate-500 dark:text-gray-400">
                                                    <div className="flex items-center gap-1"><Clock size={12} /> {s.allDay ? '종일' : start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
                                                    {s.location && <div className="flex items-center gap-1 truncate"><MapPin size={12} /> {s.location}</div>}
                                                </div>
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {isScheduleModalOpen && (
                    <ScheduleModal
                        isOpen={isScheduleModalOpen}
                        onClose={() => setIsScheduleModalOpen(false)}
                        selectedDate={selectedDate || new Date()}
                        editingSchedule={editingSchedule}
                        calendars={calendars}
                        onSave={(data) => {
                            if (editingSchedule) setSchedules(prev => prev.map(s => s.id === editingSchedule.id ? { ...s, ...data } : s));
                            else setSchedules(prev => [...prev, { ...data, id: Math.random().toString() }]);
                            setIsScheduleModalOpen(false);
                        }}
                        onDelete={(id) => {
                            setSchedules(prev => prev.filter(s => s.id !== id));
                            setIsScheduleModalOpen(false);
                        }}
                    />
                )}
                {isDayScheduleModalOpen && selectedDate && (
                    <DayScheduleModal
                        date={selectedDate}
                        schedules={daySchedules}
                        calendars={calendars}
                        onClose={() => setIsDayScheduleModalOpen(false)}
                        onSelectSchedule={handleDayScheduleSelect}
                        onCreateSchedule={() => {
                            setEditingSchedule(null);
                            setIsDayScheduleModalOpen(false);
                            setIsScheduleModalOpen(true);
                        }}
                    />
                )}
                {isAddCalendarModalOpen && (
                    <AddCalendarModal
                        isOpen={isAddCalendarModalOpen}
                        onClose={() => setIsAddCalendarModalOpen(false)}
                        onSave={(newCal) => {
                            setCalendars(prev => [...prev, { ...newCal, id: Math.random().toString(), isVisible: true }]);
                            setIsAddCalendarModalOpen(false);
                        }}
                    />
                )}
            </AnimatePresence>

            {/* FAB for adding schedule */}
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                    setSelectedDate(new Date());
                    setEditingSchedule(null);
                    setIsScheduleModalOpen(true);
                }}
                className="fixed right-6 bottom-24 z-30 w-14 h-14 bg-teal-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-teal-600 transition-colors"
            >
                <Plus size={28} />
            </motion.button>



            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
            `}</style>
        </div>
    );
};

// --- Modals (ScheduleModal, AddCalendarModal) ---
const DayScheduleModal: React.FC<{
    date: Date;
    schedules: Schedule[];
    calendars: CalendarCategory[];
    onClose: () => void;
    onSelectSchedule: (schedule: Schedule) => void;
    onCreateSchedule: () => void;
}> = ({ date, schedules, calendars, onClose, onSelectSchedule, onCreateSchedule }) => {
    const formatHeader = (value: Date) => {
        return value.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });
    };

    const formatTime = (schedule: Schedule) => {
        if (schedule.allDay) return '종일';
        const start = new Date(schedule.start);
        const end = new Date(schedule.end);
        const startLabel = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        const endLabel = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        return `${startLabel} - ${endLabel}`;
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 16 }}
                className="relative w-full max-w-md h-[70vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
                <div className="p-5 border-b border-slate-200 dark:border-white/5 flex items-center">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">일정 목록</p>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white">{formatHeader(date)}</h3>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 no-scrollbar">
                    {schedules.map((schedule) => {
                        const calendar = calendars.find(c => c.id === schedule.calendarId);
                        return (
                            <button
                                key={schedule.id}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onSelectSchedule(schedule);
                                }}
                                className="w-full text-left bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-200 dark:border-white/5 hover:border-teal-500/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-10 rounded-full" style={{ backgroundColor: calendar?.color }} />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{schedule.title}</h4>
                                        <div className="text-[11px] text-slate-500 dark:text-gray-400 mt-1">
                                            {formatTime(schedule)}
                                            {schedule.location && ` • ${schedule.location}`}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
                <div className="p-4 border-t border-slate-200 dark:border-white/5">
                    <button
                        onClick={onCreateSchedule}
                        className="w-full h-12 border border-slate-300 dark:border-slate-700 rounded-2xl flex items-center justify-center text-slate-300 dark:text-slate-700 hover:text-teal-500 hover:border-teal-400 dark:hover:text-teal-400 transition-colors"
                    >
                        <span className="w-8 h-8 rounded-full border border-current flex items-center justify-center">
                            <Plus size={16} />
                        </span>
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const AddCalendarModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { name: string, color: string }) => void;
}> = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [color, setColor] = useState('#10b981');
    const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#64748b', '#06b6d4'];
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-black">새 캘린더 만들기</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><X size={20} /></button>
                </div>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">이름</label>
                        <input type="text" autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="예: 프로젝트" className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">테마 색상</label>
                        <div className="grid grid-cols-4 gap-3">
                            {colors.map(c => (
                                <button key={c} onClick={() => setColor(c)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${color === c ? 'ring-4 ring-teal-500/20 scale-110' : 'hover:scale-105'}`} style={{ backgroundColor: c }}>
                                    {color === c && <Check size={20} className="text-white" />}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button onClick={() => onSave({ name, color })} disabled={!name} className="w-full py-4 bg-teal-500 text-white rounded-2xl font-black shadow-xl mt-4">캘린더 생성</button>
                </div>
            </motion.div>
        </div>
    );
};

const ScheduleModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    selectedDate: Date | null;
    editingSchedule: Schedule | null;
    calendars: CalendarCategory[];
    onSave: (data: any) => void;
    onDelete?: (id: string) => void;
}> = ({ isOpen, onClose, selectedDate, editingSchedule, calendars, onSave, onDelete }) => {
    const [title, setTitle] = useState(editingSchedule?.title || '');
    const [start, setStart] = useState(editingSchedule?.start || (selectedDate ? new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''));
    const [end, setEnd] = useState(editingSchedule?.end || (selectedDate ? new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000 + 3600000).toISOString().slice(0, 16) : ''));
    const [allDay, setAllDay] = useState(editingSchedule?.allDay || false);
    const [calendarId, setCalendarId] = useState(editingSchedule?.calendarId || calendars[0]?.id);
    const [description, setDescription] = useState(editingSchedule?.description || '');
    const [location, setLocation] = useState(editingSchedule?.location || '');
    const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
                initial={{ opacity: 0, y: 120 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 120 }}
                className="relative w-full max-w-md md:max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                <div className="p-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-white dark:bg-slate-900">
                    <div className="w-6" />
                    <h2 className="text-lg font-black">{editingSchedule ? '일정 수정' : '새 일정 등록'}</h2>
                    {editingSchedule ? (
                        <button
                            onClick={() => setDeleteConfirmOpen(true)}
                            className="p-2 -mr-2 rounded-full text-slate-500 hover:text-red-500 transition-colors"
                            aria-label="일정 삭제"
                        >
                            <Trash size={18} />
                        </button>
                    ) : (
                        <div className="w-6" />
                    )}
                </div>
                <div className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-6 pb-28">
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="일정 제목" className="w-full bg-transparent text-2xl font-black outline-none" />
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4"><Clock className="text-slate-400" size={20} /><span className="text-sm font-medium">종일</span></div>
                                <button onClick={() => setAllDay(!allDay)} className={`w-12 h-6 rounded-full transition-colors relative ${allDay ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-800'}`}><div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${allDay ? 'left-7' : 'left-1'}`} /></button>
                            </div>
                            <div className="pl-9 space-y-3">
                                <div className="flex items-center justify-between"><span className="text-sm text-slate-500">시작</span><input type={allDay ? "date" : "datetime-local"} value={allDay ? start.split('T')[0] : start} onChange={e => setStart(e.target.value)} className="bg-slate-100 dark:bg-slate-800 rounded-lg px-2 py-1 text-sm outline-none" /></div>
                                <div className="flex items-center justify-between"><span className="text-sm text-slate-500">종료</span><input type={allDay ? "date" : "datetime-local"} value={allDay ? end.split('T')[0] : end} onChange={e => setEnd(e.target.value)} className="bg-slate-100 dark:bg-slate-800 rounded-lg px-2 py-1 text-sm outline-none" /></div>
                            </div>
                            <div className="flex flex-wrap gap-2 pl-9">
                                {calendars.map(cal => (
                                    <button key={cal.id} onClick={() => setCalendarId(cal.id)} className={`px-3 py-1.5 rounded-full text-xs font-bold ${calendarId === cal.id ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>{cal.name}</button>
                                ))}
                            </div>
                            <div className="flex items-center gap-4"><MapPin className="text-slate-400" size={20} /><input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="장소 추가" className="flex-1 text-sm outline-none bg-transparent" /></div>
                            <div className="flex items-start gap-4"><AlignLeft className="text-slate-400" size={20} /><textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="메모 추가..." className="flex-1 text-sm outline-none bg-transparent resize-none h-24" /></div>
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 grid grid-cols-2 gap-3">
                    <button
                        onClick={() => onSave({ title, start, end, allDay, calendarId, description, location })}
                        disabled={!title}
                        className="py-3 rounded-xl font-bold bg-teal-500 text-white disabled:opacity-30"
                    >
                        저장
                    </button>
                    <button
                        onClick={onClose}
                        className="py-3 rounded-xl font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                        닫기
                    </button>
                </div>
                <AnimatePresence>
                    {editingSchedule && isDeleteConfirmOpen && (
                        <div className="absolute inset-0 z-30 flex items-center justify-center">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setDeleteConfirmOpen(false)}
                                className="absolute inset-0 bg-black/50"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                className="relative w-full max-w-xs bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-5"
                            >
                                <h3 className="text-base font-black text-slate-900 dark:text-slate-100">정말 삭제할까요?</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">삭제하면 복구할 수 없습니다.</p>
                                <div className="mt-5 grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setDeleteConfirmOpen(false)}
                                        className="py-2.5 rounded-xl font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                    >
                                        취소
                                    </button>
                                    <button
                                        onClick={() => {
                                            onDelete?.(editingSchedule.id);
                                            setDeleteConfirmOpen(false);
                                        }}
                                        className="py-2.5 rounded-xl font-bold bg-red-500 text-white"
                                    >
                                        삭제
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

export default CalendarPage;
