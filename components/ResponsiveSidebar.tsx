
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
}

const ResponsiveSidebar: React.FC<ResponsiveSidebarProps> = ({
    isOpen,
    onClose,
    title,
    headerAction,
    footerAction,
    children,
    desktopPosition = 'left'
}) => {
    // Shared Content Structure
    const SidebarContent = (
        <div className="flex flex-col h-full">
            {/* Header Area */}

            {/* Main Nav / Items Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {children}
            </div>

            {/* Mobile Footer Area */}
            {footerAction && (
                <div className="md:hidden pt-4 mt-auto border-t border-slate-200 dark:border-white/5">
                    {footerAction}
                </div>
            )}
        </div>
    );

    const desktopClasses = desktopPosition === 'left' ? 'left-0 border-r' : 'right-0 border-l';

    return (
        <>
            {/* Desktop View: Fixed Side Panel */}
            <aside className={`fixed top-16 bottom-0 ${desktopClasses} w-64 md:left-16 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-white/5 p-4 hidden md:block overflow-y-auto z-30 transition-colors`}>
                {SidebarContent}
            </aside>

            {/* Mobile View: Slide-out Drawer */}
            <div
                className={`fixed inset-0 z-[60] md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Drawer */}
                <aside
                    className={`absolute right-0 top-0 bottom-0 w-[80%] max-w-xs bg-white dark:bg-slate-900 p-6 shadow-2xl transition-transform duration-300 border-l border-slate-200 dark:border-white/5 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    {SidebarContent}
                </aside>
            </div>
        </>
    );
};

export default ResponsiveSidebar;
