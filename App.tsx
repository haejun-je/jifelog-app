
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/marketing/Header';
import Hero from './components/marketing/Hero';
import FeatureShowcase from './components/marketing/FeatureShowcase';
import SignupCTA from './components/marketing/SignupCTA';
import Footer from './components/marketing/Footer';
import InstallPrompt from './components/marketing/InstallPrompt';
import DrivePage from './components/pages/DrivePage';
import SettingsPage from './components/pages/SettingsPage';
import SignupPage from './components/pages/SignupPage';
import RecentFilesPage from './components/pages/RecentFilesPage';
import BookmarkPage from './components/pages/BookmarkPage';
import LoginPage from './components/pages/LoginPage';
import NodesPage from './components/pages/NodesPage';
import CalendarPage from './components/pages/CalendarPage';
import FeedPage from './components/pages/FeedPage';
import FeedPageV2 from './components/pages/FeedPageV2';
import DiaryListPage from './components/pages/DiaryListPage';
import DiaryWritePage from './components/pages/DiaryWritePage';
import DiaryDetailPage from './components/pages/DiaryDetailPage';
import DiaryEditPage from './components/pages/DiaryEditPage';

import MainLayout from './components/layout/MainLayout';

const HomePage: React.FC<{
  onLogin: () => void;
  onSignup: () => void;
  onSettings: () => void;
  navigateToCalendar: () => void;
  navigateToBookmark: () => void;
  navigateToFeed: () => void;
}> = ({
  onLogin,
  onSignup,
  onSettings,
  navigateToCalendar,
  navigateToBookmark,
  navigateToFeed,
}) => {
  const scrollToShowcase = () => {
    document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <Header onLogin={onLogin} onSignup={onSignup} onSettings={onSettings} />
      <main className="bg-[#071019]">
        <Hero onSignup={onSignup} onExplore={scrollToShowcase} />

        <section className="border-t border-white/8 bg-[linear-gradient(180deg,#071019_0%,#08111c_30%,#0b1320_100%)]">
          <div className="mx-auto max-w-screen-xl px-6 py-12 md:px-8 md:py-14">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-300">One place</p>
                <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-white md:text-4xl">
                  하루를 관리하는 모든 화면을 한 흐름으로
                </h2>
              </div>
              <InstallPrompt />
            </div>

            <section id="showcase">
              <FeatureShowcase
                onFeed={navigateToFeed}
                onCalendar={navigateToCalendar}
                onBookmark={navigateToBookmark}
                onSignup={onSignup}
              />
            </section>

            <section id="cta" className="pb-12">
              <SignupCTA onSignup={onSignup} onLogin={onLogin} />
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const navigate = useNavigate();

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const openLogin = () => {
    navigate('/login');
  };

  const openSignup = () => {
    navigate('/signup');
  };

  const navigateToDrive = () => {
    navigate('/drive');
    window.scrollTo(0, 0);
  };

  const navigateToHome = () => {
    navigate('/');
    window.scrollTo(0, 0);
  };

  const navigateToRecentFiles = () => {
    navigate('/drive/recent');
    window.scrollTo(0, 0);
  };

  const navigateToNodes = () => {
    navigate('/drive/nodes');
    window.scrollTo(0, 0);
  };

  const navigateToSettings = () => {
    navigate('/settings');
    window.scrollTo(0, 0);
  };

  const navigateToCalendar = () => {
    navigate('/calendar');
    window.scrollTo(0, 0);
  };

  const navigateToBookmark = () => {
    navigate('/bookmarks');
    window.scrollTo(0, 0);
  };

  const navigateToFeed = () => {
    navigate('/feed');
    window.scrollTo(0, 0);
  };

  return (

    <div className="min-h-screen transition-colors duration-300">
      <Routes>
        <Route path="/" element={<HomePage onLogin={openLogin} onSignup={openSignup} onSettings={navigateToSettings} navigateToCalendar={navigateToCalendar} navigateToBookmark={navigateToBookmark} navigateToFeed={navigateToFeed} />} />
        <Route path="/drive" element={<MainLayout><DrivePage onBack={navigateToHome} onSeeAllRecent={navigateToRecentFiles} onSeeAllNodes={navigateToNodes} /></MainLayout>} />
        <Route path="/drive/recent" element={<MainLayout><RecentFilesPage onBack={navigateToDrive} /></MainLayout>} />
        <Route path="/drive/nodes" element={<MainLayout><NodesPage onBack={navigateToDrive} /></MainLayout>} />
        <Route path="/bookmarks" element={<MainLayout><BookmarkPage onBack={navigateToDrive} /></MainLayout>} />
        <Route path="/calendar" element={<MainLayout><CalendarPage onBack={navigateToDrive} /></MainLayout>} />
        <Route path="/feed" element={<MainLayout><FeedPageV2 /></MainLayout>} />
        <Route path="/feed-v2" element={<MainLayout><FeedPageV2 /></MainLayout>} />
        <Route path="/diary" element={<MainLayout><DiaryListPage /></MainLayout>} />
        <Route path="/diary/write" element={<MainLayout><DiaryWritePage /></MainLayout>} />
        <Route path="/diary/:id/edit" element={<MainLayout><DiaryEditPage /></MainLayout>} />
        <Route path="/diary/:id" element={<MainLayout><DiaryDetailPage /></MainLayout>} />
        <Route path="/settings" element={<SettingsPage onBack={navigateToHome} theme={theme} onThemeChange={setTheme} />} />

        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
};

export default App;
