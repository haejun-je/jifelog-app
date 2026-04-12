import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { AlignLeft, Calendar, ChevronLeft, Clock, MapPin, Share2, Trash, X } from 'lucide-react';
import type { CalendarCategory } from '../../calendar/CalendarSidebar';
import type { Schedule } from './types';
import { formatKoreanDate, formatKoreanTime } from './utils';

interface ScheduleDetailPageProps {
    schedule: Schedule;
    calendars: CalendarCategory[];
    onBack: () => void;
    onEdit: () => void;
    onDelete: (id: string) => void;
}

const ScheduleDetailPage: React.FC<ScheduleDetailPageProps> = ({ schedule, calendars, onBack, onEdit, onDelete }) => {
    const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);
    const calendar = calendars.find((item) => item.id === schedule.calendarId);
    const start = new Date(schedule.start);
    const end = new Date(schedule.end);

    const scheduleShareText = [
        `일정: ${schedule.title}`,
        schedule.allDay
            ? `일시: ${formatKoreanDate(start)} ~ ${formatKoreanDate(end)}`
            : `일시: ${formatKoreanDate(start)} ${formatKoreanTime(start)} ~ ${formatKoreanDate(end)} ${formatKoreanTime(end)}`,
        calendar ? `캘린더: ${calendar.name}` : null,
        schedule.location ? `장소: ${schedule.location}` : null,
        schedule.description ? `메모: ${schedule.description}` : null,
    ].filter(Boolean).join('\n');

    const handleShare = async () => {
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(scheduleShareText);
            } else {
                const textarea = document.createElement('textarea');
                textarea.value = scheduleShareText;
                textarea.setAttribute('readonly', '');
                textarea.style.position = 'fixed';
                textarea.style.top = '0';
                textarea.style.left = '0';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();

                const copied = document.execCommand('copy');
                document.body.removeChild(textarea);

                if (!copied) {
                    throw new Error('Clipboard copy failed');
                }
            }

            toast.success('클립보드에 저장했습니다.', {
                duration: 1000,
            });
        } catch {
            toast.error('공유를 실행하지 못했습니다.', {
                duration: 1000,
            });
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center h-16 px-2 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-white/5 flex-shrink-0">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <ChevronLeft size={22} className="text-slate-600 dark:text-slate-300" />
                </button>
                <h1 className="flex-1 text-center text-base font-black text-slate-900 dark:text-white">일정 상세</h1>
                <div className="w-10" />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-5">
                    <div className="flex items-start gap-3">
                        <div className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: calendar?.color || '#ccc' }} />
                        <div className="flex-1 min-w-0">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{schedule.title}</h2>
                        </div>
                    </div>
                    {calendar && (
                        <>
                            <div className="h-px bg-slate-100 dark:bg-white/5 my-3" />
                            <div className="flex items-center gap-3">
                                <Calendar size={17} className="text-slate-400 flex-shrink-0" />
                                <p className="text-sm text-slate-700 dark:text-slate-200">{calendar.name}</p>
                            </div>
                        </>
                    )}
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl p-5">
                    <div className="flex items-start gap-3">
                        <Clock size={17} className="text-slate-400 flex-shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            {schedule.allDay ? (
                                <>
                                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{formatKoreanDate(start)}</p>
                                    {start.toDateString() !== end.toDateString() && (
                                        <p className="text-xs text-slate-400">~ {formatKoreanDate(end)}</p>
                                    )}
                                    <p className="text-xs text-slate-400 mt-1">하루종일</p>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{formatKoreanDate(start)}</p>
                                    <p className="text-xs text-slate-400">{formatKoreanTime(start)} ~ {formatKoreanTime(end)}</p>
                                </>
                            )}
                        </div>
                    </div>
                    {schedule.location && (
                        <>
                            <div className="h-px bg-slate-100 dark:bg-white/5 my-3" />
                            <div className="flex items-center gap-3">
                                <MapPin size={17} className="text-slate-400 flex-shrink-0" />
                                <p className="text-sm text-slate-700 dark:text-slate-200">{schedule.location}</p>
                            </div>
                        </>
                    )}
                </div>

                {schedule.description && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5">
                        <div className="flex items-start gap-3">
                            <AlignLeft size={17} className="text-slate-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">{schedule.description}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="px-4 py-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-white/5 flex-shrink-0">
                <div className="grid grid-cols-4 gap-2">
                    <button onClick={handleShare} className="py-3.5 rounded-2xl font-bold text-xs flex flex-col items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <Share2 size={16} />
                        공유
                    </button>
                    <button onClick={onEdit} className="py-3.5 rounded-2xl font-bold text-xs flex flex-col items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <AlignLeft size={16} />
                        편집
                    </button>
                    <button onClick={() => setIsDeleteConfirm(true)} className="py-3.5 rounded-2xl font-bold text-xs flex flex-col items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <Trash size={16} />
                        삭제
                    </button>
                    <button onClick={onBack} className="py-3.5 rounded-2xl font-bold text-xs flex flex-col items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <X size={16} />
                        닫기
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isDeleteConfirm && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteConfirm(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-xs bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-5">
                            <h3 className="font-black text-slate-900 dark:text-white">일정을 삭제할까요?</h3>
                            <p className="text-sm text-slate-400 mt-2">삭제하면 복구할 수 없습니다.</p>
                            <div className="grid grid-cols-2 gap-3 mt-5">
                                <button onClick={() => setIsDeleteConfirm(false)} className="py-2.5 rounded-xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm">취소</button>
                                <button onClick={() => onDelete(schedule.id)} className="py-2.5 rounded-xl font-bold bg-red-500 text-white text-sm">삭제</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ScheduleDetailPage;
