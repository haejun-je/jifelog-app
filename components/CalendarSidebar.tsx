import React from 'react';
import { Plus } from 'lucide-react';
import ResponsiveSidebar from './ResponsiveSidebar';
import SidebarItem from './SidebarItem';
import SidebarSection from './SidebarSection';

export interface CalendarCategory {
    id: string;
    name: string;
    color: string;
    isVisible: boolean;
}

interface CalendarSidebarProps {
    calendars: CalendarCategory[];
    onToggleVisibility: (id: string) => void;
    onAddCalendar: () => void;
    isOpen?: boolean;
    onClose?: () => void;
}

const CalendarSidebar: React.FC<CalendarSidebarProps> = ({
    calendars,
    onToggleVisibility,
    onAddCalendar,
    isOpen = false,
    onClose = () => { }
}) => {
    return (
        <ResponsiveSidebar
            title="캘린더 서비스"
            isOpen={isOpen}
            onClose={onClose}
            footerAction={
                <button
                    onClick={onAddCalendar}
                    className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-teal-500/20"
                >
                    새 캘린더 추가
                </button>
            }
        >
            <SidebarSection
                title="내 캘린더"
                action={
                    <button
                        onClick={onAddCalendar}
                        className="hidden md:block p-1 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                        title="캘린더 추가"
                    >
                        <Plus size={16} />
                    </button>
                }
            >
                {calendars.map(calendar => (
                    <SidebarItem
                        key={calendar.id}
                        label={calendar.name}
                        onClick={() => onToggleVisibility(calendar.id)}
                        leftElement={
                            <div className="relative flex items-center">
                                <div
                                    className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${calendar.isVisible ? '' : 'bg-transparent border-slate-300 dark:border-slate-600'}`}
                                    style={{
                                        backgroundColor: calendar.isVisible ? calendar.color : undefined,
                                        borderColor: calendar.isVisible ? calendar.color : undefined
                                    }}
                                />
                            </div>
                        }
                        active={false} // Checkboxes handle state
                    />
                ))}
            </SidebarSection>

            {/* Desktop-only secondary action */}
            <div className="mt-8 pt-4 border-t border-slate-200 dark:border-white/5 hidden md:block">
                <button
                    onClick={onAddCalendar}
                    className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                    <Plus size={14} />
                    캘린더 추가
                </button>
            </div>
        </ResponsiveSidebar>
    );
};

export default CalendarSidebar;
