
import React from 'react';
import GlobalSidebar from './GlobalSidebar';
import BottomMenu from './BottomMenu';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
            {/* Desktop Left LNB */}
            <GlobalSidebar />

            {/* Main View Area */}
            <div className="flex-1 flex flex-col md:pl-16 relative">
                {children}
            </div>

            {/* Mobile Bottom LNB */}
            <BottomMenu />
        </div>
    );
};

export default MainLayout;
