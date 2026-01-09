
import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, ChevronRight as ArrowIcon } from 'lucide-react';

const SchedulePreview: React.FC = () => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const events = [
    { id: 1, title: '팀 회의', time: '14:00', day: 15 },
    { id: 2, title: '프로젝트 마감', time: '18:00', day: 18 },
    { id: 3, title: '친구 만남', time: '19:00', day: 22 },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-white mb-1">일정 관리</h2>
          <p className="text-gray-400 text-sm">중요한 순간을 놓치지 마세요</p>
        </div>
        <button className="bg-teal-500 text-white px-4 py-2 rounded-xl text-xs font-bold">
          일정 추가
        </button>
      </div>

      <div className="dark-card rounded-3xl overflow-hidden mb-10">
        <div className="bg-teal-600/80 p-4 flex items-center justify-between text-white">
          <ChevronLeft size={20} />
          <span className="font-bold text-lg">2026년 1월</span>
          <ChevronRight size={20} />
        </div>
        <div className="p-6">
          <div className="grid grid-cols-7 gap-y-4 text-center mb-6">
            {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
              <span key={d} className={`text-[11px] font-bold ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-500'}`}>
                {d}
              </span>
            ))}
            {/* Calendar Placeholder */}
            {Array.from({ length: 4 }).map((_, i) => <span key={`empty-${i}`} />)}
            {days.map((day) => {
              const hasEvent = events.some(e => e.day === day);
              const isToday = day === 2;
              return (
                <div key={day} className="relative flex justify-center">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-colors
                    ${isToday ? 'bg-teal-500 text-white' : 'text-gray-300'}
                    ${hasEvent && !isToday ? 'border border-teal-500/30' : ''}
                  `}>
                    {day}
                  </div>
                  {hasEvent && <div className="absolute bottom-1 w-1 h-1 bg-teal-400 rounded-full" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2 text-white">
          <CalendarIcon className="text-teal-400" size={18} />
          <h3 className="font-bold">다가오는 일정</h3>
        </div>
        {events.map((event) => (
          <div key={event.id} className="dark-card rounded-2xl p-4 flex items-center gap-4 group cursor-pointer hover:bg-slate-800/80 transition-colors">
            <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center text-teal-400 font-bold">
              {event.day}
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-white mb-1">{event.title}</div>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                <Clock size={12} />
                {event.time}
              </div>
            </div>
            <ArrowIcon className="text-gray-600 group-hover:text-teal-400 transition-colors" size={20} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchedulePreview;
