
import React, { useState } from 'react';
import BookmarkHeader from './BookmarkHeader';
import BookmarkSidebar from './BookmarkSidebar';
import BookmarkList from './BookmarkList';
import BookmarkDetail from './BookmarkDetail';
import AddBookmarkModal from './AddBookmarkModal';
import { Bookmark } from './BookmarkCard';
import BottomMenu from './BottomMenu';

const BookmarkPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [selectedFolderId, setSelectedFolderId] = useState('all');
    const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    // Mock data - Folders
    const folders = [
        { id: 'all', name: 'All Bookmarks', count: 128, type: 'all' as const },
        { id: 'default', name: 'Unsorted', count: 4, type: 'default' as const },
        { id: 'dev', name: 'Development', count: 42, type: 'user' as const },
        { id: 'design', name: 'Design Inspiration', count: 28, type: 'user' as const },
        { id: 'reading', name: 'Reading List', count: 15, type: 'user' as const },
    ];

    // Mock data - Bookmarks
    const bookmarks: Bookmark[] = [
        {
            id: '1',
            title: 'React Documentation',
            url: 'https://react.dev',
            status: 'done',
            createdAt: '2024-01-20T10:00:00Z',
            favicon: 'https://react.dev/favicon.ico'
        },
        {
            id: '2',
            title: 'Tailwind CSS - Rapidly build modern websites',
            url: 'https://tailwindcss.com',
            status: 'done',
            createdAt: '2024-01-21T14:30:00Z',
            favicon: 'https://tailwindcss.com/favicons/favicon.ico'
        },
        {
            id: '3',
            title: 'Vite | Next Generation Frontend Tooling',
            url: 'https://vitejs.dev',
            status: 'processing',
            createdAt: '2024-01-23T09:15:00Z',
            favicon: 'https://vitejs.dev/logo.svg'
        },
        {
            id: '4',
            title: 'Complex PDF Report',
            url: 'https://example.com/report.pdf',
            status: 'failed',
            createdAt: '2024-01-22T16:45:00Z'
        },
        {
            id: '5',
            title: 'Dribbble - Discover the World’s Top Designers & Creative Professionals',
            url: 'https://dribbble.com',
            status: 'done',
            createdAt: '2024-01-19T11:20:00Z'
        },
    ];

    const handleSelectBookmark = (bookmark: Bookmark) => {
        setSelectedBookmark(bookmark);
    };

    const handleBackFromDetail = () => {
        setSelectedBookmark(null);
    };

    const selectedFolder = folders.find(f => f.id === selectedFolderId) || folders[0];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white flex flex-col transition-colors relative">
            <BookmarkHeader
                onBack={onBack}
                onMenuClick={() => setSidebarOpen(true)}
            />

            <div className="flex flex-1 overflow-hidden h-[calc(100vh-64px)]">
                <BookmarkSidebar
                    folders={folders}
                    selectedFolderId={selectedFolderId}
                    onSelectFolder={(id) => {
                        setSelectedFolderId(id);
                        setSelectedBookmark(null); // Return to list view when changing folders
                    }}
                    onAddFolder={() => console.log('Add folder clicked')}
                    isOpen={isSidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                <main className="flex-1 overflow-y-auto relative w-full pb-24">
                    {selectedBookmark ? (
                        <BookmarkDetail
                            bookmark={selectedBookmark}
                            onBack={handleBackFromDetail}
                            onDelete={() => {
                                console.log('Delete', selectedBookmark.id);
                                setSelectedBookmark(null);
                            }}
                            onMove={() => console.log('Move', selectedBookmark.id)}
                        />
                    ) : (
                        <BookmarkList
                            folderName={selectedFolder.name}
                            count={selectedFolder.count}
                            bookmarks={bookmarks}
                            onSelectBookmark={handleSelectBookmark}
                        />
                    )}
                </main>
            </div>

            {/* Floating Action Button (FAB) - Moved up to accommodate Bottom Menu */}
            <button
                onClick={() => setIsAddModalOpen(true)}
                className="fixed bottom-20 right-6 w-14 h-14 bg-teal-500 hover:bg-teal-600 text-white rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 z-40"
            >
                {/* Plus Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
            </button>


            <AddBookmarkModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />

            <BottomMenu />
        </div>
    );
};

export default BookmarkPage;
