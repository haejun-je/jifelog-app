
import React from 'react';
import { Plus, User, Menu } from 'lucide-react';

// Adjusted props interface
interface BookmarkHeaderProps {
    onBack: () => void;
    onMenuClick?: () => void;
}

const BookmarkHeader: React.FC<BookmarkHeaderProps> = ({ onBack, onMenuClick }) => {
    return (
        <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/5 h-16 px-5 flex items-center justify-between">
            {/* Left: Back Button & Title */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onBack}
                    className="p-2 -ml-2 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    {/* Back Arrow Icon (using Lucide ArrowLeft or ChevronLeft) */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                    즐겨찾기
                </h1>
            </div>

            {/* Right: Menu Button (Mobile Only) */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                >
                    <Menu size={24} />
                </button>
            </div>
        </header>
    );
};

export default BookmarkHeader;
