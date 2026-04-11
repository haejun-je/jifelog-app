
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Routes, Route, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Toaster, ToastBar } from 'react-hot-toast';
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
import { CalendarProvider } from './components/pages/calendar/CalendarContext';
import CalendarScheduleFormRoute from './components/pages/calendar/CalendarScheduleFormRoute';
import CalendarScheduleDetailRoute from './components/pages/calendar/CalendarScheduleDetailRoute';
import CalendarTodoFormRoute from './components/pages/calendar/CalendarTodoFormRoute';
import CalendarTodoDetailRoute from './components/pages/calendar/CalendarTodoDetailRoute';

import MainLayout from './components/layout/MainLayout';

const SlideOverlayRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ x: '100%' }}
    animate={{ x: 0 }}
    exit={{ x: '100%' }}
    transition={{ type: 'spring', stiffness: 320, damping: 32 }}
    className="fixed inset-0 z-[60] flex flex-col bg-slate-50 dark:bg-[#0f172a]"
  >
    {children}
  </motion.div>
);

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
  const location = useLocation();

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
      <Toaster
        position="top-center"
        containerStyle={{
          top: '80vh',
        }}
        toastOptions={{
          duration: 1000,
          style: {
            borderRadius: '16px',
            background: '#0f172a',
            color: '#f8fafc',
            fontSize: '14px',
            fontWeight: 700,
            padding: '12px 16px',
          },
        }}
      >
        {(t) => (
          <ToastBar
            toast={t}
            style={{
              ...t.style,
              animation: t.visible
                ? 'toast-slide-up 220ms cubic-bezier(0.22, 1, 0.36, 1)'
                : 'toast-fade-out 180ms ease-in forwards',
            }}
          />
        )}
      </Toaster>
      <style>
        {`
          @keyframes toast-slide-up {
            from {
              opacity: 0;
              transform: translateY(14px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes toast-fade-out {
            from {
              opacity: 1;
            }
            to {
              opacity: 0;
            }
          }
        `}
      </style>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage onLogin={openLogin} onSignup={openSignup} onSettings={navigateToSettings} navigateToCalendar={navigateToCalendar} navigateToBookmark={navigateToBookmark} navigateToFeed={navigateToFeed} />} />
          <Route path="/drive" element={<MainLayout><DrivePage onBack={navigateToHome} onSeeAllRecent={navigateToRecentFiles} onSeeAllNodes={navigateToNodes} /></MainLayout>} />
          <Route path="/drive/recent" element={<MainLayout><RecentFilesPage onBack={navigateToDrive} /></MainLayout>} />
          <Route path="/drive/nodes" element={<MainLayout><NodesPage onBack={navigateToDrive} /></MainLayout>} />
          <Route path="/bookmarks" element={<MainLayout><BookmarkPage onBack={navigateToDrive} /></MainLayout>} />
          <Route path="/calendar" element={<MainLayout><CalendarProvider><Outlet /></CalendarProvider></MainLayout>}>
            <Route index element={<CalendarPage onBack={navigateToDrive} />} />
            <Route path="write" element={<SlideOverlayRoute><CalendarScheduleFormRoute mode="create" /></SlideOverlayRoute>} />
            <Route path=":id/edit" element={<SlideOverlayRoute><CalendarScheduleFormRoute mode="edit" /></SlideOverlayRoute>} />
            <Route path=":id" element={<SlideOverlayRoute><CalendarScheduleDetailRoute /></SlideOverlayRoute>} />
            <Route path="todo/write" element={<SlideOverlayRoute><CalendarTodoFormRoute mode="create" /></SlideOverlayRoute>} />
            <Route path="todo/:id/edit" element={<SlideOverlayRoute><CalendarTodoFormRoute mode="edit" /></SlideOverlayRoute>} />
            <Route path="todo/:id" element={<SlideOverlayRoute><CalendarTodoDetailRoute /></SlideOverlayRoute>} />
          </Route>
          <Route path="/feed" element={<MainLayout><FeedPageV2 /></MainLayout>} />
          <Route path="/feed-v2" element={<MainLayout><FeedPageV2 /></MainLayout>} />
          <Route path="/diary" element={<MainLayout><DiaryListPage /></MainLayout>} />
          <Route path="/diary/write" element={<MainLayout><SlideOverlayRoute><DiaryWritePage /></SlideOverlayRoute></MainLayout>} />
          <Route path="/diary/:id/edit" element={<MainLayout><SlideOverlayRoute><DiaryEditPage /></SlideOverlayRoute></MainLayout>} />
          <Route path="/diary/:id" element={<MainLayout><SlideOverlayRoute><DiaryDetailPage /></SlideOverlayRoute></MainLayout>} />
          <Route path="/settings" element={<SettingsPage onBack={navigateToHome} theme={theme} onThemeChange={setTheme} />} />

          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

export default App;
