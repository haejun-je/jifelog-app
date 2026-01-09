import React, { useState, useEffect } from 'react';
import { ChevronLeft, Folder, MoreVertical, Search } from 'lucide-react';

interface FoldersPageProps {
    onBack: () => void;
}

const FoldersPage: React.FC<FoldersPageProps> = ({ onBack }) => {
    const [isMounted, setIsMounted] = useState(false);

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
        <div className="max-w-screen-md mx-auto min-h-screen flex flex-col bg-slate-50 dark:bg-[#0f172a] transition-colors pt-16">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/5 px-5 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 text-slate-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-white transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-xl font-black text-slate-900 dark:text-white">폴더</h1>
                </div>
                <button className="p-2 text-slate-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-white transition-colors">
                    <Search size={22} />
                </button>
            </div>

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
    );
};

export default FoldersPage;
