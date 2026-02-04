
import React from 'react';
import { ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden transition-colors">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-200 via-slate-50 to-slate-50 dark:from-slate-800 dark:via-[#0f172a] dark:to-[#0f172a] z-0" />

      {/* Visual Logo Container */}
      <div className="relative z-10 mb-14">
        <div className="w-72 md:w-[480px]">
          <img src="/logo.png" alt="JifeLog Logo" className="w-full h-auto drop-shadow-xl" />
        </div>
      </div>

      <div className="relative z-10 space-y-6 max-w-lg mx-auto">
        <p className="text-xl md:text-2xl font-bold text-slate-800 dark:text-gray-100 tracking-wide">삶의 여정을 기록하다</p>

        <p className="text-slate-500 dark:text-gray-400 text-base md:text-lg leading-relaxed opacity-90">
          단순한 기록을 넘어, 당신의 하루가 작품이 되는 공간.<br />
          소중한 추억, 복잡한 일정, 그리고 나만의 생각까지.<br />
          JifeLog에서 당신의 모든 순간이 빛나기 시작합니다.
        </p>
      </div>

      <div className="absolute bottom-12 left-0 right-0 flex justify-center animate-bounce-slow text-slate-400 dark:text-gray-500">
        <ChevronDown size={32} />
      </div>
    </div>
  );
};

export default Hero;
