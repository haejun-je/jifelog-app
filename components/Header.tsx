
import React from 'react';
import { Settings } from 'lucide-react';

interface HeaderProps {
  onLogin: () => void;
  onSignup: () => void;
  onSettings?: () => void;
  hideSignup?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onLogin, onSignup, onSettings, hideSignup }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200/50 dark:border-white/5 transition-colors">
      <div className="max-w-screen-md mx-auto px-5 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-black tracking-tighter text-teal-600 dark:text-teal-400">JifeLog</h1>
        </div>

        <div className="flex items-center gap-2">
          {/*        <button 
            onClick={onSettings}
            className="p-2 text-slate-400 hover:text-teal-500 transition-colors"
          >
            <Settings size={20} />
          </button> */}
          <button
            onClick={onLogin}
            className="text-sm font-semibold text-slate-500 dark:text-gray-400 px-3 py-2 hover:text-teal-600 dark:hover:text-white transition-colors"
          >
            로그인
          </button>
          {!hideSignup && (
            <button
              onClick={onSignup}
              className="text-xs font-bold bg-teal-500 text-white px-4 py-2 rounded-full shadow-lg shadow-teal-500/20 hover:bg-teal-600 transition-colors"
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
