import React, { useState, useEffect } from 'react';
import { ChevronLeft, Folder, MoreVertical, Search, Menu } from 'lucide-react';
import SideMenu from './SideMenu';
import BottomMenu from './BottomMenu';

interface NodesPageProps {
    onBack: () => void;
}

const NodesPage: React.FC<NodesPageProps> = ({ onBack }) => {
    const [isMounted, setIsMounted] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        window.scrollTo(0, 0);
    }, []);

    // Extended mock data for folders
    const allFolders = [
        { name: '2024 여행 사진', items: 42, date: '2024.01.20' },
        { name: '업무 관련', items: 15, date: '2024.01.18' },
        { name: '백업 데이터', items: 3, date: '2024.01.05' },
        { name: '프로젝트 A', items: 12, date: '2023.12.25' },
        { name: '개인 문서', items: 8, date: '2023.12.20' },
        { name: '디자인 리소스', items: 64, date: '2023.12.15' },
        { name: '공유 폴더', items: 5, date: '2023.12.10' },
        { name: '임시 보관함', items: 0, date: '2023.12.01' },
        { name: '보안 문서', items: 2, date: '2023.11.28' },
        { name: '앱 아이콘', items: 24, date: '2023.11.20' },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0f172a] transition-colors">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/5 h-16 px-5 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">내 드라이브</h1>
                </div>

                {/* Right: Menu Button (Mobile Only) */}
                <button
                    onClick={() => setIsMenuOpen(true)}
                    className="md:hidden p-2 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <Menu size={24} />
                </button>
            </header>

            {/* Content Wrapper */}
            <div className="flex flex-1 overflow-hidden h-[calc(100vh-64px)]">
                {/* Sidebar (Responsive) */}
                <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto w-full relative md:ml-64 md:pr-64 pb-24">
                    <div className="max-w-7xl mx-auto">
                        {/* Folders List */}
                        <div className={`p-5 flex-1 transition-all duration-500 ease-in-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                            <div className="space-y-3">
                                {allFolders.map((folder, i) => (
                                    <div key={i} className="dark-card rounded-2xl p-4 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center text-teal-600 dark:text-teal-500">
                                                <Folder size={26} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-800 dark:text-white mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                                    {folder.name}
                                                </div>
                                                <div className="text-[10px] text-slate-500 dark:text-gray-500">
                                                    항목 {folder.items}개 • {folder.date}
                                                </div>
                                            </div>
                                        </div>
                                        <button className="p-2 text-slate-400 dark:text-gray-600 hover:text-slate-900 dark:hover:text-white">
                                            <MoreVertical size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <BottomMenu />
        </div>
    );
};

export default NodesPage;
