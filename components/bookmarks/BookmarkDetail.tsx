
import React from 'react';
import { ArrowLeft, ExternalLink, Trash2, FolderInput, Download, AlertCircle, Loader2, FileText, Share2 } from 'lucide-react';
import { Bookmark } from './BookmarkCard';

interface BookmarkDetailProps {
    bookmark: Bookmark;
    onBack: () => void;
    onDelete: () => void;
    onMove: () => void;
}

const BookmarkDetail: React.FC<BookmarkDetailProps> = ({ bookmark, onBack, onDelete, onMove }) => {
    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-white/5 animate-in slide-in-from-right-4 duration-300">
            {/* Detail Header */}
            <header className="h-16 px-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 text-slate-400 hover:text-teal-600 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                            {bookmark.title || 'Untitled Page'}
                        </h2>
                        <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-slate-400 hover:text-teal-500 hover:underline truncate block"
                        >
                            {bookmark.url}
                        </a>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 mr-2">
                        Saved {new Date(bookmark.createdAt).toLocaleDateString()}
                    </span>

                    <button className="p-2 text-slate-400 hover:text-teal-600 transition-colors" title="Share">
                        <Share2 size={18} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Delete" onClick={onDelete}>
                        <Trash2 size={18} />
                    </button>
                </div>
            </header>

            {/* Main Content Area - Status & Preview */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="max-w-4xl mx-auto h-full flex flex-col gap-6">

                    {/* Status Banner */}
                    <div className={`
             rounded-xl p-4 flex items-center gap-3 border shadow-sm
             ${bookmark.status === 'processing' ? 'bg-blue-50 border-blue-100 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300' :
                            bookmark.status === 'failed' ? 'bg-red-50 border-red-100 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300' :
                                'bg-teal-50 border-teal-100 text-teal-700 dark:bg-teal-900/20 dark:border-teal-800 dark:text-teal-300'}
          `}>
                        {bookmark.status === 'processing' && <Loader2 className="animate-spin" size={20} />}
                        {bookmark.status === 'failed' && <AlertCircle size={20} />}
                        {bookmark.status === 'done' && <FileText size={20} />}

                        <span className="font-medium text-sm">
                            {bookmark.status === 'processing' && 'Page is being converted to PDF...'}
                            {bookmark.status === 'failed' && 'Failed to generate PDF. Please try again.'}
                            {bookmark.status === 'done' && 'PDF snapshot is ready.'}
                        </span>
                    </div>

                    {/* Content Viewer */}
                    <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden flex flex-col relative group">
                        {bookmark.status === 'done' ? (
                            // PDF Viewer Placeholder
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 gap-4">
                                <FileText size={64} strokeWidth={1} />
                                <p className="text-sm font-medium">PDF Preview Area</p>
                                <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-bold hover:bg-teal-500 hover:text-white transition-colors flex items-center gap-2">
                                    <Download size={16} />
                                    Download PDF
                                </button>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 gap-4">
                                {bookmark.status === 'processing' ? (
                                    <Loader2 size={48} className="animate-spin opacity-50" />
                                ) : (
                                    <AlertCircle size={48} className="opacity-50" />
                                )}
                            </div>
                        )}
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex justify-center gap-4 py-4">
                        <button
                            onClick={() => window.open(bookmark.url, '_blank')}
                            className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-slate-600 dark:text-slate-300 font-bold text-sm shadow-sm hover:border-teal-500 hover:text-teal-500 transition-colors flex items-center gap-2"
                        >
                            <ExternalLink size={16} />
                            Original Page
                        </button>
                        <button
                            onClick={onMove}
                            className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-slate-600 dark:text-slate-300 font-bold text-sm shadow-sm hover:border-teal-500 hover:text-teal-500 transition-colors flex items-center gap-2"
                        >
                            <FolderInput size={16} />
                            Move Folder
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookmarkDetail;
