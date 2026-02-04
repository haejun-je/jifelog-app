
import React from 'react';

interface SidebarItemProps {
    label: string;
    icon?: React.ElementType;
    active?: boolean;
    onClick?: () => void;
    rightElement?: React.ReactNode;
    leftElement?: React.ReactNode;
    indent?: number;
    className?: string;
    iconColor?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
    label,
    icon: Icon,
    active = false,
    onClick,
    rightElement,
    leftElement,
    indent = 0,
    className = "",
    iconColor
}) => {
    return (
        <button
            onClick={onClick}
            style={{ paddingLeft: `${indent * 1 + 0.75}rem` }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all group border border-transparent ${active
                    ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400'
                    : 'text-slate-600 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-800'
                } ${className}`}
        >
            <div className="flex items-center gap-3">
                {leftElement}
                {Icon && (
                    <Icon
                        size={18}
                        className={`${active
                                ? 'text-teal-500'
                                : iconColor || 'text-slate-400 dark:text-gray-500 group-hover:text-slate-600 dark:group-hover:text-gray-300'
                            }`}
                    />
                )}
                <span className="truncate">{label}</span>
            </div>
            {rightElement}
        </button>
    );
};

export default SidebarItem;
