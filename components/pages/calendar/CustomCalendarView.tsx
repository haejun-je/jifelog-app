import React, { useMemo } from 'react';
import type { CalendarCategory } from '../../calendar/CalendarSidebar';
import type { Schedule, Todo } from './types';
import { getDaysInMonth } from './utils';

interface CustomCalendarViewProps {
    date: Date;
    schedules: Schedule[];
    todos: Todo[];
    calendars: CalendarCategory[];
    onDateClick: (date: Date) => void;
    onEventClick: (schedule: Schedule) => void;
    onTodoClick: (todo: Todo) => void;
}

const CustomCalendarView: React.FC<CustomCalendarViewProps> = ({
    date,
    schedules,
    todos,
    calendars,
    onDateClick,
    onEventClick,
    onTodoClick,
}) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = useMemo(() => getDaysInMonth(year, month), [year, month]);
    const today = new Date();

    const scheduleLanes = useMemo(() => {
        const slots: string[][] = Array(42).fill(0).map(() => []);
        const sortedSchedules = [...schedules]
            .filter((schedule) => calendars.find((calendar) => calendar.id === schedule.calendarId)?.isVisible)
            .sort((a, b) => {
                if (a.allDay !== b.allDay) return a.allDay ? -1 : 1;
                return (new Date(b.end).getTime() - new Date(b.start).getTime()) -
                    (new Date(a.end).getTime() - new Date(a.start).getTime());
            });

        const assigned: Record<string, number> = {};

        sortedSchedules.forEach((schedule) => {
            const scheduleStart = new Date(schedule.start);
            scheduleStart.setHours(0, 0, 0, 0);
            const scheduleEnd = new Date(schedule.end);
            scheduleEnd.setHours(0, 0, 0, 0);

            let firstIndex = -1;
            let lastIndex = -1;

            days.forEach((day, index) => {
                const cellDate = new Date(day.year, day.month, day.day);
                if (cellDate >= scheduleStart && cellDate <= scheduleEnd) {
                    if (firstIndex === -1) firstIndex = index;
                    lastIndex = index;
                }
            });

            if (firstIndex === -1) return;

            let lane = 0;
            while (true) {
                let clear = true;
                for (let index = firstIndex; index <= lastIndex; index++) {
                    if (slots[index][lane]) {
                        clear = false;
                        break;
                    }
                }

                if (clear) {
                    for (let index = firstIndex; index <= lastIndex; index++) {
                        slots[index][lane] = schedule.id;
                    }
                    assigned[schedule.id] = lane;
                    break;
                }

                lane++;
            }
        });

        return assigned;
    }, [days, schedules, calendars]);

    return (
        <div className="flex flex-col h-full select-none">
            <div className="grid grid-cols-7 border-b border-slate-100 dark:border-white/5">
                {['일', '월', '화', '수', '목', '금', '토'].map((dayName, index) => (
                    <div key={dayName} className={`text-[15px] text-center font-semibold py-2 tracking-tight ${index === 0 ? 'text-red-400' : index === 6 ? 'text-blue-400' : 'text-slate-400'}`}>
                        {dayName}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 flex-1">
                {days.map((day, index) => {
                    const cellDate = new Date(day.year, day.month, day.day);
                    const isToday = today.toDateString() === cellDate.toDateString();
                    const dayLanes: Array<Schedule | null> = [];

                    schedules.forEach((schedule) => {
                        const lane = scheduleLanes[schedule.id];
                        if (lane === undefined) return;

                        const scheduleStart = new Date(schedule.start);
                        scheduleStart.setHours(0, 0, 0, 0);
                        const scheduleEnd = new Date(schedule.end);
                        scheduleEnd.setHours(0, 0, 0, 0);

                        if (cellDate >= scheduleStart && cellDate <= scheduleEnd) {
                            dayLanes[lane] = schedule;
                        }
                    });

                    const cellDateStr = `${day.year}-${String(day.month + 1).padStart(2, '0')}-${String(day.day).padStart(2, '0')}`;
                    const cellTodos = todos.filter((todo) => todo.date === cellDateStr);
                    const totalItems = Math.max(dayLanes.filter(Boolean).length, dayLanes.length) + cellTodos.length;

                    return (
                        <div
                            key={`${day.year}-${day.month}-${day.day}-${index}`}
                            onClick={() => onDateClick(cellDate)}
                            className={`border-r border-b border-slate-50 dark:border-white/5 pt-0.5 pb-1 min-h-0 flex flex-col transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/20 cursor-pointer ${!day.isCurrentMonth ? 'opacity-30' : ''}`}
                        >
                            <span className={`text-[13px] font-semibold w-5 h-5 flex items-center justify-center rounded-full ml-auto mb-0.5 mr-1 ${isToday ? 'bg-teal-500 text-white' : 'text-slate-400'}`}>
                                {day.day}
                            </span>
                            <div className="flex flex-col gap-0.5">
                                {Array.from({ length: Math.min(dayLanes.length, 3) }).map((_, laneIndex) => {
                                    const schedule = dayLanes[laneIndex];
                                    if (!schedule) return <div key={laneIndex} className="h-4" />;

                                    const calendar = calendars.find((item) => item.id === schedule.calendarId);
                                    const scheduleStart = new Date(schedule.start);
                                    scheduleStart.setHours(0, 0, 0, 0);
                                    const scheduleEnd = new Date(schedule.end);
                                    scheduleEnd.setHours(0, 0, 0, 0);
                                    const isStart = scheduleStart.getTime() === cellDate.getTime();
                                    const isEnd = scheduleEnd.getTime() === cellDate.getTime();
                                    const isMultiDay = scheduleStart.getTime() !== scheduleEnd.getTime();
                                    const isWeekStart = index % 7 === 0;

                                    if (schedule.allDay || isMultiDay) {
                                        const showTitle = isStart || isWeekStart;
                                        return (
                                            <div
                                                key={schedule.id}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    onEventClick(schedule);
                                                }}
                                                className={`h-4 text-[10px] py-0.5 truncate text-white font-medium opacity-90 transition-transform active:scale-95 relative ${!isEnd ? 'w-[calc(100%+1px)] z-10' : 'w-full'} ${isStart ? 'rounded-l-[5px]' : ''} ${isEnd ? 'rounded-r-[5px]' : ''} ${showTitle ? 'px-1.5' : 'px-0'}`}
                                                style={{ backgroundColor: calendar?.color || '#ccc' }}
                                            >
                                                {showTitle && schedule.title}
                                            </div>
                                        );
                                    }

                                    return (
                                        <div
                                            key={schedule.id}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                onEventClick(schedule);
                                            }}
                                            className="h-3 flex items-center gap-1 text-[10px] font-medium text-slate-700 dark:text-slate-300 transition-transform active:scale-95"
                                        >
                                            <div className="w-0.5 h-3 flex-shrink-0" style={{ backgroundColor: calendar?.color || '#ccc' }} />
                                            <span className="truncate">{schedule.title}</span>
                                        </div>
                                    );
                                })}
                                {cellTodos.slice(0, 2).map((todo) => (
                                    <div
                                        key={todo.id}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            onTodoClick(todo);
                                        }}
                                        className="h-3 flex items-center gap-0.5 text-[10px] font-medium transition-transform active:scale-95"
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${todo.completed ? 'bg-violet-300' : 'bg-violet-500'}`} />
                                        <span className={`truncate ${todo.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300'}`}>
                                            {todo.title}
                                        </span>
                                    </div>
                                ))}
                                {totalItems > 4 && (
                                    <div className="h-4 text-[9px] font-bold text-slate-400 dark:text-slate-500 flex items-center pl-1">
                                        +{totalItems - 4}
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

export default CustomCalendarView;
