import React, { useState, useEffect } from 'react';
import { ChevronLeft, FileText, Image, MoreVertical, Search } from 'lucide-react';

interface RecentFilesPageProps {
    onBack: () => void;
}

const RecentFilesPage: React.FC<RecentFilesPageProps> = ({ onBack }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        window.scrollTo(0, 0);
    }, []);

    // Extended mock data
    const allRecentFiles = [
        { name: '프로젝트 제안서.pdf', size: '1.2 MB', date: '2시간 전', type: 'pdf' },
        { name: '가족 모임.jpg', size: '4.5 MB', date: '5시간 전', type: 'image' },
        { name: '아이디어 회의록.docx', size: '45 KB', date: '어제', type: 'doc' },
        { name: '2024 예산안.xlsx', size: '2.1 MB', date: '2일 전', type: 'xls' },
        { name: '워크샵 영상.mp4', size: '154 MB', date: '3일 전', type: 'video' },
        { name: '디자인 시안_final.fig', size: '12 MB', date: '1주 전', type: 'image' },
        { name: '계약서 초안.pdf', size: '540 KB', date: '1주 전', type: 'pdf' },
        { name: '참고자료.zip', size: '85 MB', date: '2주 전', type: 'zip' },
        { name: '분기 보고서.ppt', size: '5.4 MB', date: '3주 전', type: 'ppt' },
        { name: '로고 모음.ai', size: '8.2 MB', date: '1달 전', type: 'image' },
    ];

    return (
        <div className="max-w-5xl mx-auto w-full min-h-screen flex flex-col bg-slate-50 dark:bg-[#0f172a] transition-colors pt-16">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/5 px-5 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 text-slate-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-white transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-xl font-black text-slate-900 dark:text-white">최근 파일</h1>
                </div>
                <button className="p-2 text-slate-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-white transition-colors">
                    <Search size={22} />
                </button>
            </div>

            {/* File List */}
            <div className={`p-5 flex-1 transition-all duration-500 ease-in-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="space-y-3">
                    {allRecentFiles.map((file, i) => (
                        <div key={i} className="dark-card rounded-2xl p-4 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 dark:text-gray-400 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                                    {file.type === 'pdf' ? <FileText size={24} className="text-red-500 dark:text-red-400" /> :
                                        file.type === 'image' ? <Image size={24} className="text-teal-500 dark:text-teal-400" /> :
                                            <FileText size={24} className="text-blue-500 dark:text-blue-400" />}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-800 dark:text-white mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                        {file.name}
                                    </div>
                                    <div className="text-[10px] text-slate-500 dark:text-gray-500">
                                        {file.size} • {file.date}
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

export default RecentFilesPage;
