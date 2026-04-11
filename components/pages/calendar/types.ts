export type AppView = 'calendar' | 'register' | 'schedule-detail' | 'todo-detail';

export interface Schedule {
    id: string;
    title: string;
    start: string;
    end: string;
    allDay: boolean;
    calendarId: string;
    description?: string;
    location?: string;
}

export interface Todo {
    id: string;
    title: string;
    date: string;
    time?: string;
    allDay: boolean;
    completed: boolean;
    memo?: string;
    createdAt: string;
}
