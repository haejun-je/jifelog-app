import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RegisterPage from './RegisterPage';
import { useCalendarContext } from './CalendarContext';

const CalendarTodoFormRoute: React.FC<{ mode: 'create' | 'edit' }> = ({ mode }) => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { calendars, selectedDate, findTodo, saveTodo } = useCalendarContext();

    const editingTodo = mode === 'edit' && id ? findTodo(id) : null;

    if (mode === 'edit' && !editingTodo) {
        return null;
    }

    return (
        <RegisterPage
            selectedDate={editingTodo ? new Date(`${editingTodo.date}T00:00:00`) : selectedDate || new Date()}
            editingSchedule={null}
            editingTodo={editingTodo}
            calendars={calendars}
            initialTab="todo"
            onCancel={() => navigate(editingTodo ? `/calendar/todo/${editingTodo.id}` : '/calendar')}
            onSaveSchedule={() => undefined}
            onSaveTodo={(data) => {
                saveTodo(data, editingTodo?.id);
                navigate('/calendar');
            }}
        />
    );
};

export default CalendarTodoFormRoute;
