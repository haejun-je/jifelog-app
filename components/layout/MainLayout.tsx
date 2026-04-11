
import React from 'react';
import GlobalSidebar from './GlobalSidebar';
import BottomMenu from '../navigation/BottomMenu';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="flex min-h-screen overflow-x-hidden bg-slate-50 dark:bg-slate-900 transition-colors">
            {/* Desktop Left LNB */}
            <GlobalSidebar />

            {/* Main View Area */}
            <div className="relative flex min-w-0 flex-1 flex-col overflow-x-hidden md:pl-16">
                {children}
            </div>

            {/* Mobile Bottom LNB */}
            <BottomMenu />
        </div>
    );
};

export default MainLayout;
