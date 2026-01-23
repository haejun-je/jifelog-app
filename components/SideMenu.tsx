import React, { useState } from 'react';
import { X, ChevronRight, ChevronDown, Folder, Plus } from 'lucide-react';

interface FolderNode {
    id: string;
    name: string;
    children?: FolderNode[];
}

const initialFolders: FolderNode[] = [
    {
        id: '1',
        name: '내 드라이브',
        children: [
            {
                id: '1-1',
                name: '2024 여행 사진',
                children: [
                    { id: '1-1-1', name: '제주도' },
                    { id: '1-1-2', name: '일본' },
                ]
            },
            {
                id: '1-2',
                name: '업무 관련',
                children: [
                    { id: '1-2-1', name: '프로젝트 A' },
                    { id: '1-2-2', name: '재무 보고서' },
                ]
            },
            { id: '1-3', name: '백업 데이터' },
        ]
    },
    {
        id: '2',
        name: '공유 폴더',
        children: [
            { id: '2-1', name: '팀 프로젝트' },
            { id: '2-2', name: '가족 사진' },
        ]
    }
];

interface FolderTreeItemProps {
    node: FolderNode;
    level: number;
}

const FolderTreeItem: React.FC<FolderTreeItemProps> = ({ node, level }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = node.children && node.children.length > 0;

    const handleToggle = () => {
        if (hasChildren) {
            setIsOpen(!isOpen);
        }
    };

    return (
        <div className="select-none">
            <div
                className={`flex items-center gap-2 py-2 px-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors ${level > 0 ? 'ml-4' : ''}`}
                onClick={handleToggle}
            >
                <div className="text-slate-400 dark:text-slate-500">
                    {hasChildren ? (
                        isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                    ) : (
                        <div className="w-4" /> // Spacer
                    )}
                </div>
                <Folder size={18} className="text-teal-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{node.name}</span>
            </div>
            {isOpen && hasChildren && (
                <div className="border-l border-slate-200 dark:border-slate-800 ml-[21px]">
                    {node.children!.map((child) => (
                        <FolderTreeItem key={child.id} node={child} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

interface SideMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose }) => {
    const MenuContent = (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-5 md:p-4 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
                <h2 className="text-lg md:text-sm font-bold text-slate-900 dark:text-white md:text-slate-400 md:dark:text-gray-500 md:uppercase md:tracking-widest">폴더 목록</h2>
                <div className="flex items-center gap-2">
                    {/* Desktop Add Button */}
                    <button className="hidden md:block p-1 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                        <Plus size={16} />
                    </button>

                    {/* Mobile Close Button */}
                    <button
                        onClick={onClose}
                        className="md:hidden p-2 -mr-2 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-2">
                <div className="space-y-1">
                    {initialFolders.map((node) => (
                        <FolderTreeItem key={node.id} node={node} level={0} />
                    ))}
                </div>
            </div>

            {/* Footer (Mobile Only) */}
            <div className="md:hidden p-5 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/50">
                <button className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-sm font-bold transition-colors">
                    새 폴더 만들기
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar (Left side, persistent) */}
            <aside className="fixed top-16 bottom-0 left-0 w-64 bg-slate-50/50 dark:bg-slate-900/50 border-r border-slate-200 dark:border-white/5 hidden md:block overflow-y-auto z-30">
                {MenuContent}
            </aside>

            {/* Mobile Drawer (Right side, toggleable) */}
            <div
                className={`fixed inset-0 z-[60] md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/50"
                    onClick={onClose}
                />

                {/* Drawer */}
                <div
                    className={`absolute top-0 right-0 bottom-0 w-[280px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-white/5 shadow-2xl transition-transform duration-300 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    {MenuContent}
                </div>
            </div>
        </>
    );
};

export default SideMenu;
