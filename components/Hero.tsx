
import React from 'react';
import { ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden transition-colors">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-200 via-slate-50 to-slate-50 dark:from-slate-800 dark:via-[#0f172a] dark:to-[#0f172a] z-0" />
      
      {/* Visual Logo Container */}
      <div className="relative z-10 mb-8">
        <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-teal-300 via-blue-400 to-blue-600 p-0.5 overflow-hidden shadow-2xl">
          <div className="w-full h-full rounded-full relative overflow-hidden flex items-center justify-center">
             <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="50" fill="transparent" />
                <path d="M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z" fill="#0d9488" opacity="0.6" />
                <path d="M0,60 Q25,40 50,60 T100,60 L100,100 L0,100 Z" fill="#0369a1" />
                <circle cx="70" cy="30" r="4" fill="#f8fafc" opacity="0.8" />
             </svg>
          </div>
        </div>
      </div>

      <div className="relative z-10 space-y-4">
        <h1 className="logo-font text-6xl md:text-7xl text-slate-900 dark:text-white drop-shadow-lg">JifeLog</h1>
        <p className="text-xl md:text-2xl font-bold text-slate-800 dark:text-gray-100 tracking-wide">삶의 여정을 기록하다</p>
        
        <p className="max-w-xs mx-auto text-slate-500 dark:text-gray-400 text-sm md:text-base leading-relaxed pt-8 opacity-80">
          당신의 소중한 순간들을 기록하고, 일정을 관리하며, 삶의 모든 것을 하나의 공간에서 정리하세요
        </p>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce-slow text-slate-400 dark:text-gray-500">
        <ChevronDown size={32} />
      </div>
    </div>
  );
};

export default Hero;
