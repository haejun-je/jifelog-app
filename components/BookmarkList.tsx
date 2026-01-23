
import React, { useState } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import BookmarkCard, { Bookmark } from './BookmarkCard';

interface BookmarkListProps {
    folderName: string;
    count: number;
    bookmarks: Bookmark[];
    onSelectBookmark: (bookmark: Bookmark) => void;
}

const BookmarkList: React.FC<BookmarkListProps> = ({ folderName, count, bookmarks, onSelectBookmark }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <div className={`p-6 md:p-8 max-w-7xl mx-auto space-y-8 transition-all duration-500 ease-in-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-baseline gap-2">
                        {folderName}
                        <span className="text-sm font-medium text-slate-400 dark:text-slate-500">{count} items</span>
                    </h2>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" size={16} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search bookmarks..."
                            className="w-full md:w-64 bg-slate-100 dark:bg-slate-800/50 border-none rounded-xl py-2 pl-9 pr-4 text-sm font-medium focus:ring-2 focus:ring-teal-500/20 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all"
                        />
                    </div>

                    <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        <ArrowUpDown size={14} />
                        <span className="hidden sm:inline">Recent</span>
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {bookmarks
                    .filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.url.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(bookmark => (
                        <div key={bookmark.id} onClick={() => onSelectBookmark(bookmark)} className="cursor-pointer">
                            <BookmarkCard
                                bookmark={bookmark}
                                onOpen={() => window.open(bookmark.url, '_blank')}
                                onViewPdf={() => onSelectBookmark(bookmark)}
                                onDelete={() => console.log('delete', bookmark.id)}
                                onMove={() => console.log('move', bookmark.id)}
                            />
                        </div>
                    ))}
                {bookmarks.length === 0 && (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400">
                        <p>No bookmarks found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookmarkList;
