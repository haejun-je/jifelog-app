import React, { createContext, useContext, useMemo, useState } from 'react';
import type { CalendarCategory } from '../../calendar/CalendarSidebar';
import type { Schedule, Todo } from './types';
import { toLocalDateStr } from './utils';

interface CalendarContextValue {
    calendars: CalendarCategory[];
    schedules: Schedule[];
    todos: Todo[];
    selectedDate: Date | null;
    setSelectedDate: React.Dispatch<React.SetStateAction<Date | null>>;
    setCalendars: React.Dispatch<React.SetStateAction<CalendarCategory[]>>;
    setSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>;
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
    toggleCalendarVisibility: (id: string) => void;
    allVisibleSchedules: Schedule[];
    getSchedulesForDate: (date: Date) => Schedule[];
    getTodosForDate: (date: Date) => Todo[];
    findSchedule: (id: string) => Schedule | null;
    findTodo: (id: string) => Todo | null;
    saveSchedule: (data: Omit<Schedule, 'id'>, id?: string) => Schedule;
    deleteSchedule: (id: string) => void;
    saveTodo: (data: Omit<Todo, 'id' | 'completed' | 'createdAt'>, id?: string) => Todo;
    deleteTodo: (id: string) => void;
    toggleTodoComplete: (id: string) => void;
}

const CalendarContext = createContext<CalendarContextValue | null>(null);

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    const [todos, setTodos] = useState<Todo[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const toggleCalendarVisibility = (id: string) =>
        setCalendars((prev) => prev.map((calendar) => calendar.id === id ? { ...calendar, isVisible: !calendar.isVisible } : calendar));

    const allVisibleSchedules = useMemo(() => {
        const visibleIds = calendars.filter((calendar) => calendar.isVisible).map((calendar) => calendar.id);
        return schedules.filter((schedule) => visibleIds.includes(schedule.calendarId));
    }, [schedules, calendars]);

    const getSchedulesForDate = (date: Date) => {
        const target = new Date(date);
        target.setHours(0, 0, 0, 0);

        return allVisibleSchedules.filter((schedule) => {
            const start = new Date(schedule.start);
            start.setHours(0, 0, 0, 0);
            const end = new Date(schedule.end);
            end.setHours(0, 0, 0, 0);
            return target >= start && target <= end;
        }).sort((a, b) => a.start.localeCompare(b.start));
    };

    const getTodosForDate = (date: Date): Todo[] =>
        todos.filter((todo) => todo.date === toLocalDateStr(date));

    const findSchedule = (id: string) =>
        schedules.find((schedule) => schedule.id === id) ?? null;

    const findTodo = (id: string) =>
        todos.find((todo) => todo.id === id) ?? null;

    const saveSchedule = (data: Omit<Schedule, 'id'>, id?: string) => {
        if (id) {
            const updated = { ...data, id };
            setSchedules((prev) => prev.map((schedule) => schedule.id === id ? updated : schedule));
            return updated;
        }

        const created = { ...data, id: Math.random().toString() };
        setSchedules((prev) => [...prev, created]);
        return created;
    };

    const deleteSchedule = (id: string) => {
        setSchedules((prev) => prev.filter((schedule) => schedule.id !== id));
    };

    const saveTodo = (data: Omit<Todo, 'id' | 'completed' | 'createdAt'>, id?: string) => {
        if (id) {
            const existing = findTodo(id);
            const updated: Todo = {
                id,
                completed: existing?.completed ?? false,
                createdAt: existing?.createdAt ?? new Date().toISOString(),
                ...data,
            };
            setTodos((prev) => prev.map((todo) => todo.id === id ? updated : todo));
            return updated;
        }

        const created: Todo = {
            ...data,
            id: Math.random().toString(),
            completed: false,
            createdAt: new Date().toISOString(),
        };
        setTodos((prev) => [...prev, created]);
        return created;
    };

    const deleteTodo = (id: string) => {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
    };

    const toggleTodoComplete = (id: string) => {
        setTodos((prev) => prev.map((todo) => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
    };

    return (
        <CalendarContext.Provider
            value={{
                calendars,
                schedules,
                todos,
                selectedDate,
                setSelectedDate,
                setCalendars,
                setSchedules,
                setTodos,
                toggleCalendarVisibility,
                allVisibleSchedules,
                getSchedulesForDate,
                getTodosForDate,
                findSchedule,
                findTodo,
                saveSchedule,
                deleteSchedule,
                saveTodo,
                deleteTodo,
                toggleTodoComplete,
            }}
        >
            {children}
        </CalendarContext.Provider>
    );
};

export const useCalendarContext = () => {
    const context = useContext(CalendarContext);

    if (!context) {
        throw new Error('useCalendarContext must be used within CalendarProvider');
    }

    return context;
};
