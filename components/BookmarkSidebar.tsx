
import React from 'react';
import { Folder, Plus, MoreHorizontal, Star, Inbox, X } from 'lucide-react';

interface FolderItem {
    id: string;
    name: string;
    count: number;
    type: 'all' | 'default' | 'user';
}

interface BookmarkSidebarProps {
    folders: FolderItem[];
    selectedFolderId: string;
    onSelectFolder: (id: string) => void;
    onAddFolder: () => void;
    isOpen?: boolean; // For mobile
    onClose?: () => void; // For mobile
}

const BookmarkSidebar: React.FC<BookmarkSidebarProps> = ({
    folders,
    selectedFolderId,
    onSelectFolder,
    onAddFolder,
    isOpen = false,
    onClose
}) => {
    // Shared Content
    const SidebarContent = (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 md:mb-2 px-2 pt-2 md:pt-0">
                <h2 className="text-sm md:text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest">
                    Folders
                </h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onAddFolder}
                        className="hidden md:block p-1 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                    >
                        <Plus size={16} />
                    </button>
                    {/* Mobile Close Button */}
                    <button
                        onClick={onClose}
                        className="md:hidden p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <nav className="space-y-2 md:space-y-1 overflow-y-auto flex-1">
                {folders.map(folder => {
                    const isActive = selectedFolderId === folder.id;

                    let Icon = Folder;
                    if (folder.type === 'all') Icon = Star;
                    if (folder.type === 'default') Icon = Inbox;

                    return (
                        <button
                            key={folder.id}
                            onClick={() => {
                                onSelectFolder(folder.id);
                                if (onClose) onClose(); // Close on selection (mobile)
                            }}
                            className={`w-full flex items-center justify-between px-4 py-3.5 md:px-3 md:py-2.5 rounded-xl text-base md:text-sm font-medium transition-all group ${isActive
                                ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm'
                                : 'text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            <div className="flex items-center gap-4 md:gap-3">
                                <Icon
                                    size={18}
                                    className={`w-6 h-6 md:w-[18px] md:h-[18px] ${isActive ? 'text-teal-500' : 'text-slate-400 dark:text-gray-500 group-hover:text-slate-600 dark:group-hover:text-gray-300'}`}
                                    {...(folder.type === 'all' ? { fill: isActive ? 'currentColor' : 'none' } : {})}
                                />
                                <span>{folder.name}</span>
                            </div>

                            <div className="flex items-center">
                                {folder.type === 'user' && (
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity mr-1">
                                        <div className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md">
                                            <MoreHorizontal className="w-5 h-5 md:w-[14px] md:h-[14px]" />
                                        </div>
                                    </div>
                                )}
                                <span className={`text-sm md:text-xs ${isActive ? 'text-teal-600/70 dark:text-teal-400/70' : 'text-slate-400'}`}>
                                    {folder.count}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </nav>

            {/* Footer (Mobile Only) */}
            <div className="md:hidden p-5 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/50">
                <button
                    onClick={onAddFolder}
                    className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-sm font-bold transition-colors"
                >
                    Add New Folder
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="fixed top-16 bottom-0 left-0 w-64 bg-slate-50/50 dark:bg-slate-900/50 border-r border-slate-200 dark:border-white/5 p-4 hidden md:block overflow-y-auto z-30">
                {SidebarContent}
            </aside>

            {/* Mobile Sidebar (Drawer) */}
            <div className={`fixed inset-0 z-[60] md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

                {/* Drawer */}
                <aside className={`absolute right-0 top-0 bottom-0 w-[80%] max-w-xs bg-white dark:bg-slate-900 p-4 shadow-2xl transition-transform duration-300 border-l border-slate-200 dark:border-white/5 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    {SidebarContent}
                </aside>
            </div>
        </>
    );
};

export default BookmarkSidebar;
