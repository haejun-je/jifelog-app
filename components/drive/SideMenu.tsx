import React, { useState } from 'react';
import { Folder, ChevronDown, ChevronRight, Plus, ArrowRight } from 'lucide-react';
import ResponsiveSidebar from '../sidebars/ResponsiveSidebar';
import SidebarItem from '../sidebars/SidebarItem';
import SidebarSection from '../sidebars/SidebarSection';

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
    selectedId: string | null;
    onSelect: (id: string) => void;
}

const FolderTreeItem: React.FC<FolderTreeItemProps> = ({ node, level, selectedId, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = node.children && node.children.length > 0;

    const isSelected = selectedId === node.id;

    const handleToggle = () => {
        onSelect(node.id);
        if (hasChildren) {
            setIsOpen(!isOpen);
        }
    };

    return (
        <div className="select-none">
            <SidebarItem
                label={node.name}
                icon={Folder}
                indent={level}
                onClick={handleToggle}
                active={isSelected}
                leftElement={
                    hasChildren ? (
                        <div className="text-slate-400 dark:text-slate-500">
                            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </div>
                    ) : (
                        <div className="w-3.5" />
                    )
                }
                rightElement={
                    isSelected ? (
                        <button
                            className="w-6 h-3 rounded-full text-slate-400 dark:text-slate-500 flex items-center justify-center"
                            type="button"
                            onClick={(event) => {
                                event.stopPropagation();
                            }}
                        >
                            <ArrowRight size={14} />
                        </button>
                    ) : null
                }
            />
            {isOpen && hasChildren && (
                <div className="ml-2 border-l border-slate-200 dark:border-white/5">
                    {node.children!.map((child) => (
                        <FolderTreeItem
                            key={child.id}
                            node={child}
                            level={level + 1}
                            selectedId={selectedId}
                            onSelect={onSelect}
                        />
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
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
    return (
        <ResponsiveSidebar
            title="스토리지 관리"
            isOpen={isOpen}
            onClose={onClose}
            headerAction={
                <button
                    className="hidden md:block p-1 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                    title="새 폴더"
                >
                    <Plus size={16} />
                </button>
            }
            footerAction={
                <button className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-teal-500/20">
                    새 폴더 만들기
                </button>
            }
        >
            <SidebarSection
                title="폴더 목록"
                action={
                    <button className="p-1 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                        <Plus size={16} />
                    </button>
                }
            >
                {initialFolders.map((node) => (
                    <FolderTreeItem
                        key={node.id}
                        node={node}
                        level={0}
                        selectedId={selectedFolderId}
                        onSelect={setSelectedFolderId}
                    />
                ))}
            </SidebarSection>

            <div className="mt-8 pt-4 border-t border-slate-200 dark:border-white/5 hidden md:block">
                <button className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    전체 폴더 보기
                </button>
            </div>
        </ResponsiveSidebar>
    );
};


export default SideMenu;
