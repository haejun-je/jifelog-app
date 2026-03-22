import React, { useEffect, useState } from 'react';

interface HeaderProps {
  onLogin: () => void;
  onSignup: () => void;
  onSettings?: () => void;
  hideSignup?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onLogin, onSignup, hideSignup }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 py-4 md:px-6">
      <div
        className={`mx-auto flex h-14 w-full max-w-screen-xl items-center justify-between rounded-full border px-5 transition-all duration-300 md:px-6 ${
          isScrolled
            ? 'border-white/10 bg-slate-950/72 shadow-[0_12px_50px_rgba(2,6,23,0.4)] backdrop-blur-xl'
            : 'border-white/8 bg-white/[0.03] backdrop-blur-md'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-teal-300 shadow-[0_0_20px_rgba(45,212,191,0.7)]" />
          <h1 className="text-sm font-black uppercase tracking-[0.34em] text-white md:text-base">JifeLog</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onLogin}
            className="rounded-full px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white md:px-4"
          >
            로그인
          </button>
          {!hideSignup && (
            <button
              onClick={onSignup}
              className="rounded-full bg-teal-400 px-4 py-2 text-sm font-black text-slate-950 transition-all hover:bg-teal-300 md:px-5"
            >
              시작하기
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
