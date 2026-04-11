import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ScheduleDetailPage from './ScheduleDetailPage';
import { useCalendarContext } from './CalendarContext';

const CalendarScheduleDetailRoute: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { calendars, findSchedule, deleteSchedule } = useCalendarContext();

    const schedule = id ? findSchedule(id) : null;

    if (!schedule) {
        return null;
    }

    return (
        <ScheduleDetailPage
            schedule={schedule}
            calendars={calendars}
            onBack={() => navigate('/calendar')}
            onEdit={() => navigate(`/calendar/${schedule.id}/edit`)}
            onDelete={(scheduleId) => {
                deleteSchedule(scheduleId);
                navigate('/calendar');
            }}
        />
    );
};

export default CalendarScheduleDetailRoute;
