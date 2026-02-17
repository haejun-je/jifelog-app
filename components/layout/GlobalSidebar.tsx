import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout, HardDrive, Calendar, Bookmark, Bot, Settings } from 'lucide-react';

const GlobalSidebar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { label: '피드', icon: Layout, path: '/feed' },
        { label: '드라이브', icon: HardDrive, path: '/drive' },
        { label: 'AI 비서', icon: Bot, path: '/ai' },
        { label: '일정', icon: Calendar, path: '/calendar' },
        { label: '즐겨찾기', icon: Bookmark, path: '/bookmarks' },
    ];

    return (
        <aside className="fixed top-0 left-0 bottom-0 w-16 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-white/5 z-[100] hidden md:flex flex-col items-center py-4 transition-colors">
            {/* User Profile */}
            <div
                className="w-10 h-10 rounded-full overflow-hidden mb-8 border-2 border-slate-100 dark:border-slate-800 cursor-pointer hover:ring-2 hover:ring-teal-500/50 transition-all flex-shrink-0"
                onClick={() => navigate('/settings')}
            >
                <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100"
                    alt="Profile"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="flex-1 flex flex-col gap-3 w-full px-2">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            title={item.label}
                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all group ${isActive
                                ? 'bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400'
                                : 'text-slate-400 dark:text-gray-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-gray-300'
                                }`}
                        >
                            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                        </button>
                    );
                })}
            </div>

            <div className="w-full px-2 pb-2">
                <button
                    onClick={() => navigate('/settings')}
                    title="설정"
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${location.pathname === '/settings'
                        ? 'bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400'
                        : 'text-slate-400 dark:text-gray-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-gray-300'
                        }`}
                >
                    <Settings size={22} />
                </button>
            </div>
        </aside>
    );
};

export default GlobalSidebar;
