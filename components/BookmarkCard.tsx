
import React from 'react';
import { MoreVertical, ExternalLink, FileText, Loader2, AlertCircle, Trash2, FolderInput } from 'lucide-react';

export interface Bookmark {
    id: string;
    title: string;
    url: string;
    favicon?: string;
    status: 'pending' | 'processing' | 'done' | 'failed';
    createdAt: string;
    previewImage?: string;
}

interface BookmarkCardProps {
    bookmark: Bookmark;
    onOpen: () => void;
    onViewPdf: () => void;
    onDelete: () => void;
    onMove: () => void;
}

const BookmarkCard: React.FC<BookmarkCardProps> = ({
    bookmark,
    onOpen,
    onViewPdf,
    onDelete,
    onMove
}) => {
    const getStatusIcon = () => {
        switch (bookmark.status) {
            case 'processing': return <Loader2 size={16} className="animate-spin text-teal-500" />;
            case 'done': return <FileText size={16} className="text-teal-500" />;
            case 'failed': return <AlertCircle size={16} className="text-red-500" />;
            default: return <div className="w-4 h-4 rounded-full border-2 border-slate-300" />;
        }
    };

    const getStatusText = () => {
        switch (bookmark.status) {
            case 'processing': return 'PDF 생성 중';
            case 'done': return 'PDF 저장됨';
            case 'failed': return '저장 실패';
            default: return '대기 중';
        }
    };

    // Helper to extract domain for favicon fallback
    const getDomain = (url: string) => {
        try {
            return new URL(url).hostname;
        } catch {
            return 'unknown';
        }
    };

    return (
        <div className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-2xl p-4 hover:shadow-md transition-all flex flex-col gap-3 relative overflow-hidden">
            {/* Top: Favicon & Title */}
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700/50 flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-white/5">
                    {bookmark.favicon ? (
                        <img src={bookmark.favicon} alt="" className="w-6 h-6 object-contain" />
                    ) : (
                        <img
                            src={`https://www.google.com/s2/favicons?domain=${getDomain(bookmark.url)}&sz=64`}
                            alt=""
                            className="w-6 h-6 object-contain opacity-70"
                            onError={(e) => { e.currentTarget.style.display = 'none' }}
                        />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate leading-tight mb-1" title={bookmark.title}>
                        {bookmark.title || bookmark.url}
                    </h3>
                    <p className="text-[11px] text-slate-400 truncate font-medium">
                        {bookmark.url}
                    </p>
                </div>

                <button className="p-1 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical size={18} />
                </button>
            </div>

            {/* Status Badge */}
            <div className="mt-auto pt-2 flex items-center gap-2">
                <div className={`
          flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold border
          ${bookmark.status === 'done' ? 'bg-teal-50 text-teal-700 border-teal-100 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-900/30' :
                        bookmark.status === 'failed' ? 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30' :
                            'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'}
        `}>
                    {getStatusIcon()}
                    <span>{getStatusText()}</span>
                </div>
                <span className="text-[10px] text-slate-400 ml-auto">
                    {new Date(bookmark.createdAt).toLocaleDateString()}
                </span>
            </div>

            {/* Hover Actions Overlay */}
            <div className="absolute inset-0 bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
                <button
                    onClick={(e) => { e.stopPropagation(); onOpen(); }}
                    className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-teal-500 hover:text-white transition-colors shadow-sm"
                    title="Original URL"
                >
                    <ExternalLink size={18} />
                </button>

                <button
                    onClick={(e) => { e.stopPropagation(); onViewPdf(); }}
                    disabled={bookmark.status !== 'done'}
                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-colors ${bookmark.status === 'done'
                            ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-teal-500 hover:text-white'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-300 cursor-not-allowed'
                        }`}
                    title="View PDF"
                >
                    <FileText size={18} />
                </button>

                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-red-500 hover:text-white transition-colors shadow-sm"
                    title="Delete"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};

export default BookmarkCard;
