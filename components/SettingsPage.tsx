
import React from 'react';
import { ChevronLeft, Moon, Sun, Monitor, Bell, Shield, Info, ChevronRight } from 'lucide-react';

interface SettingsPageProps {
  onBack: () => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onBack, theme, onThemeChange }) => {
  return (
    <div className="max-w-screen-md mx-auto min-h-screen bg-slate-50 dark:bg-[#0f172a] transition-colors">
      {/* Header */}
      <div className="glass-header sticky top-0 z-50 border-b border-slate-200 dark:border-white/5 px-5 h-16 flex items-center gap-4">
        <button onClick={onBack} className="p-2 text-slate-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-white transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-black text-slate-900 dark:text-white">설정</h1>
      </div>

      <div className="p-5 space-y-8">
        {/* Theme Settings Section */}
        <section>
          <h3 className="text-xs font-black text-slate-400 dark:text-gray-400 uppercase tracking-widest mb-4 ml-2">테마 설정</h3>
          <div className="dark-card rounded-[32px] p-2 flex gap-2">
            <button 
              onClick={() => onThemeChange('light')}
              className={`flex-1 flex flex-col items-center justify-center py-6 rounded-3xl transition-all ${theme === 'light' ? 'bg-teal-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <Sun size={24} className="mb-2" />
              <span className="text-sm font-bold">라이트</span>
            </button>
            <button 
              onClick={() => onThemeChange('dark')}
              className={`flex-1 flex flex-col items-center justify-center py-6 rounded-3xl transition-all ${theme === 'dark' ? 'bg-teal-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <Moon size={24} className="mb-2" />
              <span className="text-sm font-bold">다크</span>
            </button>
          </div>
        </section>

        {/* Other Placeholder Sections */}
        <section className="space-y-3">
          <h3 className="text-xs font-black text-slate-400 dark:text-gray-400 uppercase tracking-widest mb-4 ml-2">앱 설정</h3>
          
          <div className="dark-card rounded-[32px] overflow-hidden">
            {[
              { icon: <Bell size={20} />, label: '알림 설정', color: 'text-blue-500' },
              { icon: <Shield size={20} />, label: '개인정보 및 보안', color: 'text-emerald-500' },
              { icon: <Monitor size={20} />, label: '디스플레이 환경', color: 'text-indigo-500' },
              { icon: <Info size={20} />, label: '버전 정보', color: 'text-slate-400', value: 'v1.2.0' },
            ].map((item, i) => (
              <button 
                key={i} 
                className={`w-full p-5 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors ${i !== 3 ? 'border-b border-slate-200 dark:border-white/5' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`${item.color}`}>{item.icon}</div>
                  <span className="text-sm font-bold text-slate-800 dark:text-white">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.value && <span className="text-xs text-slate-400">{item.value}</span>}
                  <ChevronRight size={18} className="text-slate-300 dark:text-slate-600" />
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="pt-4">
          <button className="w-full p-5 bg-red-500/10 text-red-500 rounded-3xl font-bold text-sm hover:bg-red-500 hover:text-white transition-all">
            로그아웃
          </button>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
