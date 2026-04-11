export const getDaysInMonth = (year: number, month: number) => {
    const date = new Date(year, month, 1);
    const days = [];
    const firstDay = date.getDay();
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    for (let i = firstDay - 1; i >= 0; i--) {
        days.push({ day: prevMonthLastDay - i, month: month - 1, year, isCurrentMonth: false });
    }

    const lastDay = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= lastDay; i++) {
        days.push({ day: i, month, year, isCurrentMonth: true });
    }

    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
        days.push({ day: i, month: month + 1, year, isCurrentMonth: false });
    }

    return days;
};

export const formatMonthYear = (date: Date) => `${date.getFullYear()}년 ${date.getMonth() + 1}월`;

export const toLocalDateStr = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export const formatKoreanDate = (date: Date) =>
    date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });

export const formatKoreanTime = (date: Date) =>
    date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
