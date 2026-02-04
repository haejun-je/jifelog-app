
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

import MainLayout from './components/layout/MainLayout';

const HomePage: React.FC<{ onLogin: () => void; onSignup: () => void; onSettings: () => void; navigateToDrive: () => void; navigateToCalendar: () => void; navigateToBookmark: () => void; }> = ({ onLogin, onSignup, onSettings, navigateToDrive, navigateToCalendar, navigateToBookmark }) => (
  <>
    <Header onLogin={onLogin} onSignup={onSignup} onSettings={onSettings} />
    <main>
      <Hero />
      <div className="max-w-screen-md mx-auto px-5 space-y-24 py-16">
        <div className="flex justify-center">
          <InstallPrompt />
        </div>
        <section id="showcase">
          <FeatureShowcase onDrive={navigateToDrive} onCalendar={navigateToCalendar} onBookmark={navigateToBookmark} />
        </section>
        <section id="cta">
          <SignupCTA onSignup={onSignup} onLogin={onLogin} />
        </section>
      </div>
    </main>
    <Footer />
  </>
);

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

  return (

    <div className="min-h-screen transition-colors duration-300">
      <Routes>
        <Route path="/" element={<HomePage onLogin={openLogin} onSignup={openSignup} onSettings={navigateToSettings} navigateToDrive={navigateToDrive} navigateToCalendar={navigateToCalendar} navigateToBookmark={navigateToBookmark} />} />
        <Route path="/drive" element={<MainLayout><DrivePage onBack={navigateToHome} onSeeAllRecent={navigateToRecentFiles} onSeeAllNodes={navigateToNodes} /></MainLayout>} />
        <Route path="/drive/recent" element={<MainLayout><RecentFilesPage onBack={navigateToDrive} /></MainLayout>} />
        <Route path="/drive/nodes" element={<MainLayout><NodesPage onBack={navigateToDrive} /></MainLayout>} />
        <Route path="/bookmarks" element={<MainLayout><BookmarkPage onBack={navigateToDrive} /></MainLayout>} />
        <Route path="/calendar" element={<MainLayout><CalendarPage onBack={navigateToDrive} /></MainLayout>} />
        <Route path="/settings" element={<SettingsPage onBack={navigateToHome} theme={theme} onThemeChange={setTheme} />} />

        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
};

export default App;
