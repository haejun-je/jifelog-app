import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RegisterPage from './RegisterPage';
import { useCalendarContext } from './CalendarContext';

const CalendarScheduleFormRoute: React.FC<{ mode: 'create' | 'edit' }> = ({ mode }) => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { calendars, selectedDate, findSchedule, saveSchedule } = useCalendarContext();

    const editingSchedule = mode === 'edit' && id ? findSchedule(id) : null;

    if (mode === 'edit' && !editingSchedule) {
        return null;
    }

    return (
        <RegisterPage
            selectedDate={editingSchedule ? new Date(editingSchedule.start) : selectedDate || new Date()}
            editingSchedule={editingSchedule}
            editingTodo={null}
            calendars={calendars}
            initialTab="schedule"
            onCancel={() => navigate(editingSchedule ? `/calendar/${editingSchedule.id}` : '/calendar')}
            onSaveSchedule={(data) => {
                saveSchedule(data, editingSchedule?.id);
                navigate('/calendar');
            }}
            onSaveTodo={() => undefined}
        />
    );
};

export default CalendarScheduleFormRoute;
