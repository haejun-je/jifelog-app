
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import FeedPreview from './components/FeedPreview';
import DrivePreview from './components/DrivePreview';
import SchedulePreview from './components/SchedulePreview';
import SignupCTA from './components/SignupCTA';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import DrivePage from './components/DrivePage';
import SettingsPage from './components/SettingsPage';
import SignupPage from './components/SignupPage';

const HomePage: React.FC<{ onLogin: () => void; onSignup: () => void; onSettings: () => void; navigateToDrive: () => void; }> = ({ onLogin, onSignup, onSettings, navigateToDrive }) => (
  <>
    <Header onLogin={onLogin} onSignup={onSignup} onSettings={onSettings} />
    <main>
      <Hero />
      <div className="max-w-screen-md mx-auto px-5 space-y-24 py-16">
        <section id="features">
          <Features />
        </section>
        <section id="feeds">
          <FeedPreview />
        </section>
        <section id="drive">
          <DrivePreview onSeeAll={navigateToDrive} />
        </section>
        <section id="schedule">
          <SchedulePreview />
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
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
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
    setAuthModalOpen(true);
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

  const navigateToSettings = () => {
    navigate('/settings');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      <Routes>
        <Route path="/" element={<HomePage onLogin={openLogin} onSignup={openSignup} onSettings={navigateToSettings} navigateToDrive={navigateToDrive} />} />
        <Route path="/drive" element={<DrivePage onBack={navigateToHome} />} />
        <Route path="/settings" element={<SettingsPage onBack={navigateToHome} theme={theme} onThemeChange={setTheme} />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </div>
  );
};

export default App;
