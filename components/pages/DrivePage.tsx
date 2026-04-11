import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Star, Clock, Image, Video, FileText, Music,
  Folder, MoreVertical, HardDrive, ChevronRight, Plus, X
} from 'lucide-react';
import SideMenu from '../drive/SideMenu';
import ScrollAwareFab from '../common/ScrollAwareFab';
import UniversalHeader from '../layout/UniversalHeader';

interface DrivePageProps {
  onBack: () => void;
  onSeeAllRecent?: () => void;
  onSeeAllNodes?: () => void;
}

const DrivePage: React.FC<DrivePageProps> = ({ onBack, onSeeAllRecent, onSeeAllNodes }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuHistoryRef = useRef(false);
  const storageUsed = 2.8;
  const storageTotal = 15;
  const storageRatio = (storageUsed / storageTotal) * 100;

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    const handlePopState = () => {
      if (isMenuOpen) {
        setIsMenuOpen(false);
        menuHistoryRef.current = false;
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isMenuOpen]);

  const openMenu = () => {
    setIsMenuOpen(true);
    if (!menuHistoryRef.current) {
      window.history.pushState({ driveMenu: true }, '');
      menuHistoryRef.current = true;
    }
  };

  const closeMenu = () => {
    if (menuHistoryRef.current) {
      window.history.back();
    } else {
      setIsMenuOpen(false);
    }
  };

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
    { label: '즐겨찾기', icon: <Star size={20} />, color: 'text-amber-400', meta: '자주 여는 항목' },
    { label: '최근', icon: <Clock size={20} />, color: 'text-blue-400', meta: '마지막 작업 기록' },
    { label: '사진 폴더', icon: <Image size={20} />, color: 'text-teal-400', meta: '앨범과 촬영본' },
    { label: '동영상', icon: <Video size={20} />, color: 'text-violet-400', meta: '클립과 아카이브' },
    { label: '문서', icon: <FileText size={20} />, color: 'text-rose-400', meta: '문서와 메모' },
    { label: '음악', icon: <Music size={20} />, color: 'text-emerald-400', meta: '오디오 파일' },
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

  const getFileIcon = (type: string) => {
    if (type === 'pdf') return <FileText size={22} className="text-rose-500 dark:text-rose-400" />;
    if (type === 'image') return <Image size={22} className="text-teal-500 dark:text-teal-400" />;
    return <FileText size={22} className="text-blue-500 dark:text-blue-400" />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0f172a] transition-colors">
      <UniversalHeader
        title="드라이브"
        onBack={onBack}
        showBack={false}
        onMenuClick={openMenu}
        rightAction={
          <button
            onClick={() => { setIsSearchOpen((v) => !v); setSearchQuery(''); }}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={isSearchOpen ? '검색 닫기' : '검색'}
          >
            {isSearchOpen ? <X size={20} /> : <Search size={20} />}
          </button>
        }
      />

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/5 z-30 flex-shrink-0"
          >
            <div className="px-4 py-3 flex items-center gap-2">
              <Search size={16} className="text-slate-400 flex-shrink-0" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="파일, 폴더 검색"
                className="flex-1 bg-transparent text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Wrapper */}
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-64px)]">
        {/* Sidebar (Responsive) */}
        <SideMenu isOpen={isMenuOpen} onClose={closeMenu} />

        {/* Main Content */}
        <main data-fab-scroll-container className="flex-1 overflow-y-auto w-full relative">
          <div className="max-w-3xl mx-auto px-4 md:px-5 py-5 md:py-6 pb-24">

            {/* Categories Grid */}
            <section className={`transition-all duration-500 ease-in-out delay-75 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="grid grid-cols-3 gap-3">
                {categories.map((cat, i) => (
                  <button
                    key={i}
                    className="group rounded-[20px] border border-slate-200/80 dark:border-white/5 bg-white dark:bg-slate-900 px-3 py-4 text-left hover:border-teal-400/50 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors active:scale-[0.99]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className={`w-11 h-11 rounded-2xl bg-slate-50 dark:bg-slate-800/70 flex items-center justify-center ${cat.color}`}>
                        {React.cloneElement(cat.icon, { size: 22 })}
                      </div>
                      <ChevronRight size={16} className="mt-1 text-slate-300 dark:text-slate-600 group-hover:text-teal-500 transition-colors" />
                    </div>
                    <div className="mt-4">
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-200 break-keep">
                        {cat.label}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Content Lists */}
            <div className="flex-1 space-y-8 mt-8">
              <section className={`transition-all duration-500 ease-in-out delay-100 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="rounded-[28px] border border-slate-200/80 dark:border-white/5 bg-white dark:bg-slate-900 overflow-hidden">
                  <div className="px-5 py-5 md:px-6">
              {/* Recent Files Grid */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500 flex items-center gap-2">
                            <Clock size={14} /> Recent Files
                          </p>
                          <h3 className="mt-1 text-base font-semibold text-slate-800 dark:text-white">
                            최근 파일
                          </h3>
                        </div>
                        <button onClick={onSeeAllRecent} className="h-10 px-3 rounded-xl text-slate-400 dark:text-gray-500 hover:text-teal-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                          <ChevronRight size={20} />
                        </button>
                      </div>
                      <div className="space-y-3">
                        {recentFiles.slice(0, 4).map((file, i) => (
                          <button
                            key={i}
                            className="w-full rounded-2xl bg-slate-50 dark:bg-slate-800/40 px-4 py-3 text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center border border-slate-200/80 dark:border-white/5">
                                {getFileIcon(file.type)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                                  {file.name}
                                </div>
                                <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
                                  {file.size} • {file.date}
                                </div>
                              </div>
                              <ChevronRight size={18} className="text-slate-300 dark:text-slate-600 group-hover:text-teal-500 transition-colors" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Folders List */}
              <section className={`transition-all duration-500 ease-in-out delay-200 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="rounded-[28px] border border-slate-200/80 dark:border-white/5 bg-white dark:bg-slate-900 overflow-hidden">
                  <div className="flex justify-between items-center border-b border-slate-200/80 dark:border-white/5 px-5 py-4 md:px-6">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500 flex items-center gap-2">
                        <Folder size={14} /> My Drive
                      </p>
                      <h3 className="mt-1 text-base font-semibold text-slate-800 dark:text-white">
                        내 드라이브
                      </h3>
                    </div>
                    <button onClick={onSeeAllNodes} className="h-10 px-3 rounded-xl text-slate-400 dark:text-gray-500 hover:text-teal-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-white/5">
                    {folders.map((folder, i) => (
                      <div key={i} className="px-5 py-4 md:px-6 group hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-12 h-12 bg-teal-500/10 rounded-2xl flex items-center justify-center text-teal-600 dark:text-teal-500">
                              <Folder size={24} />
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-slate-800 dark:text-slate-100 mb-1 truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                {folder.name}
                              </div>
                              <div className="text-[12px] text-slate-500 dark:text-gray-400">
                                항목 {folder.items}개 • 마지막 수정 {folder.date}
                              </div>
                            </div>
                          </div>
                          <button className="p-2 text-slate-400 dark:text-gray-600 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors">
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className={`transition-all duration-500 ease-in-out delay-300 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="rounded-[28px] border border-slate-200/80 dark:border-white/5 bg-white dark:bg-slate-900 overflow-hidden">
                  <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_280px]">
                    <div className="px-5 py-5 md:px-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                            Storage
                          </p>
                          <h3 className="mt-2 text-lg font-semibold text-slate-800 dark:text-white">
                            {storageUsed} GB / {storageTotal} GB
                          </h3>
                        </div>
                        <div className="w-11 h-11 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                          <HardDrive size={22} />
                        </div>
                      </div>

                      <div className="mt-5">
                        <div className="flex items-center justify-between text-[11px] font-bold tracking-[0.16em] uppercase text-slate-400 dark:text-slate-500">
                          <span>Used</span>
                          <span>{storageRatio.toFixed(1)}%</span>
                        </div>
                        <div className="mt-3 h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[linear-gradient(90deg,#14b8a6_0%,#2dd4bf_50%,#60a5fa_100%)] shadow-[0_0_24px_rgba(45,212,191,0.35)]"
                            style={{ width: `${storageRatio}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t lg:border-t-0 lg:border-l border-slate-200/80 dark:border-white/5 px-5 py-5 md:px-6 flex items-center justify-between gap-4 bg-slate-50/70 dark:bg-slate-950/30">
                      <div>
                        <div className="text-sm font-medium text-slate-800 dark:text-white">휴지통</div>
                        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">삭제 항목 보기</div>
                      </div>
                      <button className="h-10 px-4 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition-opacity">
                        열기
                      </button>
                    </div>
                  </div>
                </div>
              </section>
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



      <ScrollAwareFab
        onClick={() => {
          handleFileSelect()
        }}
        ariaLabel="파일 추가"
        className="shadow-teal-500/30"
      >
        <Plus size={28} />
      </ScrollAwareFab>


    </div>
  );
};

export default DrivePage;
