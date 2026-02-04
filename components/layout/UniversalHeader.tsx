
import React from 'react';
import { Menu, ChevronLeft } from 'lucide-react';

interface UniversalHeaderProps {
    title: string;
    onBack?: () => void;
    showBack?: boolean;
    onMenuClick?: () => void;
    rightAction?: React.ReactNode;
}

const UniversalHeader: React.FC<UniversalHeaderProps> = ({
    title,
    onBack,
    showBack = true,
    onMenuClick,
    rightAction
}) => {
    return (
        <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/5 h-16 px-5 flex items-center justify-between flex-shrink-0 transition-colors">
            {/* Left: Back Button & Title */}
            <div className="flex items-center gap-3">
                {showBack && onBack && (
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                )}
                {onMenuClick && (
                    <button
                        onClick={onMenuClick}
                        className="md:hidden p-2 -ml-2 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                )}
                <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                    {title}
                </h1>
            </div>

            {/* Right Action & Menu */}
            <div className="flex items-center gap-2">
                {rightAction}
            </div>
        </header>
    );
};

export default UniversalHeader;
