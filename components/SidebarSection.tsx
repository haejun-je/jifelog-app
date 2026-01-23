
import React from 'react';

interface SidebarSectionProps {
    title?: string;
    children: React.ReactNode;
    action?: React.ReactNode;
    className?: string;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({
    title,
    children,
    action,
    className = ""
}) => {
    return (
        <div className={`space-y-1 ${className}`}>
            {(title || action) && (
                <div className="flex items-center justify-between px-2 mb-2">
                    {title && (
                        <h3 className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest px-1">
                            {title}
                        </h3>
                    )}
                    {action}
                </div>
            )}
            <div className="space-y-0.5">
                {children}
            </div>
        </div>
    );
};

export default SidebarSection;
