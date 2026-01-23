
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout, HardDrive, Calendar, Bookmark, Settings, Bot } from 'lucide-react';

const BottomMenu: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { label: '피드', icon: Layout, path: '/' },
        { label: '드라이브', icon: HardDrive, path: '/drive' },
        { label: 'AI 비서', icon: Bot, path: '/ai' },
        { label: '일정', icon: Calendar, path: '/schedule' },
        { label: '즐겨찾기', icon: Bookmark, path: '/bookmarks' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-200 dark:border-white/5 pb-safe">
            <div className="flex items-center justify-between h-16 max-w-screen-md mx-auto px-1">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`flex flex-col items-center justify-center h-full gap-1 transition-colors flex-1 ${isActive
                                ? 'text-teal-600 dark:text-teal-400'
                                : 'text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300'
                                }`}
                        >
                            <Icon
                                size={24}
                                strokeWidth={isActive ? 2.5 : 2}
                                fill={isActive && item.label === '즐겨찾기' ? 'currentColor' : 'none'}
                            />
                            <span className="text-[10px] font-bold whitespace-nowrap">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomMenu;
