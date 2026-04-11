import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TodoDetailPage from './TodoDetailPage';
import { useCalendarContext } from './CalendarContext';

const CalendarTodoDetailRoute: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { findTodo, deleteTodo, toggleTodoComplete } = useCalendarContext();

    const todo = id ? findTodo(id) : null;

    if (!todo) {
        return null;
    }

    return (
        <TodoDetailPage
            todo={todo}
            onBack={() => navigate('/calendar')}
            onEdit={() => navigate(`/calendar/todo/${todo.id}/edit`)}
            onDelete={(todoId) => {
                deleteTodo(todoId);
                navigate('/calendar');
            }}
            onToggleComplete={toggleTodoComplete}
        />
    );
};

export default CalendarTodoDetailRoute;
