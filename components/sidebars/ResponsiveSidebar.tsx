
import React from 'react';
import { X } from 'lucide-react';

interface ResponsiveSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    headerAction?: React.ReactNode;
    footerAction?: React.ReactNode;
    children: React.ReactNode;
    desktopPosition?: 'left' | 'right'; // Default left
    hideCloseButton?: boolean;
}

const ResponsiveSidebar: React.FC<ResponsiveSidebarProps> = ({
    isOpen,
    onClose,
    title,
    headerAction,
    footerAction,
    children,
    desktopPosition = 'left',
    hideCloseButton = false
}) => {
    // Shared Content Structure
    const SidebarContent = (
        <div className="flex flex-col h-full">
            {/* Header Area */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/5">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
                <div className="flex items-center gap-2">
                    {headerAction}
                    {!hideCloseButton && (
                        <button
                            onClick={onClose}
                            className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>
            </div>

            {/* Main Nav / Items Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                {children}
            </div>

            {/* Footer Area */}
            {footerAction && (
                <div className="pt-4 mt-auto border-t border-slate-200 dark:border-white/5 p-4">
                    {footerAction}
                </div>
            )}
        </div>
    );

    const drawerPositionClass = desktopPosition === 'left' ? 'left-0' : 'right-0';
    const drawerBorderClass = desktopPosition === 'left' ? 'border-r' : 'border-l';
    const drawerTranslateClass = desktopPosition === 'left'
        ? (isOpen ? 'translate-x-0' : '-translate-x-full')
        : (isOpen ? 'translate-x-0' : 'translate-x-full');

    return (
        <>
            {/* Slide-out Drawer (all screen sizes) */}
            <div
                className={`fixed inset-0 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Drawer */}
                <aside
                    className={`absolute ${drawerPositionClass} top-0 bottom-0 w-[80%] max-w-xs bg-white dark:bg-slate-900 p-6 shadow-2xl transition-transform duration-300 ${drawerBorderClass} border-slate-200 dark:border-white/5 ${drawerTranslateClass}`}
                >
                    {SidebarContent}
                </aside>
            </div>
        </>
    );
};

export default ResponsiveSidebar;
