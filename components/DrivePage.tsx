import React, { useState, useRef } from 'react';
import {
  ChevronLeft, Search, Star, Clock, Image, Video, FileText, Music,
  Folder, MoreVertical, Trash2, HardDrive, ChevronRight, Menu, Plus
} from 'lucide-react';
import BottomMenu from './BottomMenu';
import SideMenu from './SideMenu';

interface DrivePageProps {
  onBack: () => void;
  onSeeAllRecent?: () => void;
  onSeeAllNodes?: () => void;
}

const DrivePage: React.FC<DrivePageProps> = ({ onBack, onSeeAllRecent, onSeeAllNodes }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log('Selected file:', files[0]);
      // Handle file upload logic here
    }
  };

  const categories = [
    { label: '즐겨찾기', icon: <Star size={20} />, color: 'text-amber-400' },
    { label: '최근', icon: <Clock size={20} />, color: 'text-blue-400' },
    { label: '사진 폴더', icon: <Image size={20} />, color: 'text-teal-400' },
    { label: '동영상', icon: <Video size={20} />, color: 'text-purple-400' },
    { label: '문서', icon: <FileText size={20} />, color: 'text-red-400' },
    { label: '음악', icon: <Music size={20} />, color: 'text-emerald-400' },
  ];

  const folders = [
    { name: '2024 여행 사진', items: 42, date: '2024.01.20' },
    { name: '업무 관련', items: 15, date: '2024.01.18' },
    { name: '백업 데이터', items: 3, date: '2024.01.05' }
  ];

  const recentFiles = [
    { name: '프로젝트 제안서.pdf', size: '1.2 MB', date: '2시간 전', type: 'pdf' },
    { name: '가족 모임.jpg', size: '4.5 MB', date: '5시간 전', type: 'image' },
    { name: '아이디어 회의록.docx', size: '45 KB', date: '어제', type: 'doc' },
    { name: '아이디어 회의록.docx', size: '45 KB', date: '어제', type: 'doc' },
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
          <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">드라이브</h1>
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
        <main className="flex-1 overflow-y-auto w-full relative md:ml-64 md:pr-64">
          <div className="max-w-7xl mx-auto pb-24">

            {/* Search Input */}
            <div className="px-5 mt-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="파일, 폴더 검색"
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 pl-12 pr-4 py-3.5 rounded-2xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 shadow-sm transition-all"
                />
              </div>
            </div>

            {/* Categories Grid */}
            <div className={`p-5 grid grid-cols-3 gap-4 transition-all duration-500 ease-in-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {categories.map((cat, i) => (
                <button
                  key={i}
                  className="dark-card p-4 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-95"
                >
                  <div className={cat.color}>{React.cloneElement(cat.icon, { size: 26 })}</div>
                  <span className="text-xs font-bold text-slate-600 dark:text-gray-300">{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Content Lists */}
            <div className="flex-1 px-5 space-y-8 mt-4">
              {/* Recent Files Grid */}
              <div className={`transition-all duration-500 ease-in-out delay-100 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-black text-slate-400 dark:text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Clock size={14} /> 최근 파일
                  </h3>
                  <button onClick={onSeeAllRecent} className="p-1 text-slate-400 dark:text-gray-500 hover:text-teal-600 dark:hover:text-white transition-colors">
                    <ChevronRight size={20} />
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {recentFiles.slice(0, 4).map((file, i) => (
                    <div key={i} className="dark-card rounded-2xl p-3 flex flex-col items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group aspect-square">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 dark:text-gray-400">
                        {file.type === 'pdf' ? <FileText size={24} className="text-red-500 dark:text-red-400" /> :
                          file.type === 'image' ? <Image size={24} className="text-teal-500 dark:text-teal-400" /> :
                            <FileText size={24} className="text-blue-500 dark:text-blue-400" />}
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-bold text-slate-600 dark:text-gray-300 w-full leading-tight line-clamp-2">
                          {file.name}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-gray-500 block leading-tight mt-1">
                          {file.size}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Folders List */}
              <div className={`transition-all duration-500 ease-in-out delay-200 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-black text-slate-400 dark:text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Folder size={14} /> 내 드라이브
                  </h3>
                  <button onClick={onSeeAllNodes} className="p-1 text-slate-400 dark:text-gray-500 hover:text-teal-600 dark:hover:text-white transition-colors">
                    <ChevronRight size={20} />
                  </button>
                </div>
                <div className="space-y-3">
                  {folders.map((folder, i) => (
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

            {/* Storage & Trash Section */}
            <div className={`p-5 mt-4 transition-all duration-500 ease-in-out delay-300 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="dark-card p-5 rounded-3xl space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-slate-800 dark:text-white">
                    <HardDrive size={16} className="text-teal-600 dark:text-teal-400" />
                    <span className="text-sm font-bold">전체 저장 공간</span>
                  </div>
                  <span className="text-sm font-bold text-teal-600 dark:text-teal-400">2.8 GB / 15 GB</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full teal-gradient w-[60.6%] rounded-full shadow-[0_0_10px_rgba(45,212,191,0.5)]"></div>
                </div>
                <div className="pt-2">
                  <p className="text-[10px] text-slate-500 dark:text-gray-500 font-medium">12.2 GB 사용 가능</p>
                </div>
              </div>
              {/* Trash Button */}
              <button className="w-full flex items-center justify-center gap-2 mt-4 py-3 bg-gray-500 rounded-xl text-white font-bold hover:bg-gray-600 transition-colors active:scale-95">
                <Trash2 size={20} />
                휴지통
              </button>
            </div>
          </div>
        </main>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        onClick={handleFileSelect}
        className="fixed bottom-20 right-6 w-14 h-14 bg-teal-500 hover:bg-teal-600 text-white rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 z-40"
      >
        <Plus size={28} strokeWidth={2.5} />
      </button>

      <BottomMenu />
    </div>
  );
};

export default DrivePage;
