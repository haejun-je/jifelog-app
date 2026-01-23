import React from 'react';
import { Folder, Plus, Star, Inbox } from 'lucide-react';
import ResponsiveSidebar from './ResponsiveSidebar';
import SidebarItem from './SidebarItem';
import SidebarSection from './SidebarSection';

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
    isOpen?: boolean;
    onClose?: () => void;
}

const BookmarkSidebar: React.FC<BookmarkSidebarProps> = ({
    folders,
    selectedFolderId,
    onSelectFolder,
    onAddFolder,
    isOpen = false,
    onClose = () => { }
}) => {
    return (
        <ResponsiveSidebar
            title="즐겨찾기 소스"
            isOpen={isOpen}
            onClose={onClose}
            footerAction={
                <button
                    onClick={onAddFolder}
                    className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-teal-500/20"
                >
                    Add New Folder
                </button>
            }
        >
            <SidebarSection
                title="Folders"
                action={
                    <button
                        onClick={onAddFolder}
                        className="hidden md:block p-1 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                    >
                        <Plus size={16} />
                    </button>
                }
            >
                {folders.map(folder => {
                    const isActive = selectedFolderId === folder.id;
                    let Icon = Folder;
                    if (folder.type === 'all') Icon = Star;
                    if (folder.type === 'default') Icon = Inbox;

                    return (
                        <SidebarItem
                            key={folder.id}
                            label={folder.name}
                            icon={Icon}
                            active={isActive}
                            onClick={() => {
                                onSelectFolder(folder.id);
                                onClose();
                            }}
                            rightElement={
                                <span className={`text-[10px] font-bold ${isActive ? 'text-teal-600/70 dark:text-teal-400/70' : 'text-slate-400'}`}>
                                    {folder.count}
                                </span>
                            }
                        />
                    );
                })}
            </SidebarSection>
        </ResponsiveSidebar>
    );
};

export default BookmarkSidebar;
