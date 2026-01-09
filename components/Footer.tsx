
import React from 'react';
import { Instagram, Facebook, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-teal-900/40 border-t border-white/5 pt-20 pb-12 px-8">
      <div className="max-w-screen-md mx-auto">
        <div className="flex flex-col items-center mb-12">
          <h1 className="logo-font text-5xl text-white mb-2">JifeLog</h1>
          <p className="text-teal-400 text-sm font-bold">삶의 여정을 기록하다</p>
        </div>

        <div className="grid grid-cols-2 gap-10 mb-16">
          <div className="space-y-4">
            <h4 className="text-white font-black text-sm uppercase tracking-wider">서비스</h4>
            <ul className="space-y-2 text-teal-100/60 text-xs font-medium">
              <li>피드</li>
              <li>드라이브</li>
              <li>일정관리</li>
              <li>투두리스트</li>
            </ul>
          </div>
          <div className="space-y-4 text-right">
            <h4 className="text-white font-black text-sm uppercase tracking-wider">정보</h4>
            <ul className="space-y-2 text-teal-100/60 text-xs font-medium">
              <li>소개</li>
              <li>공지사항</li>
              <li>고객지원</li>
              <li>이용약관</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-12">
          {[Instagram, Facebook, Youtube].map((Icon, i) => (
            <button key={i} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-teal-100/60 hover:text-white hover:bg-white/10 transition-all">
              <Icon size={18} />
            </button>
          ))}
          <button className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-teal-100/60 hover:text-white hover:bg-white/10 transition-all">
            <span className="font-bold text-sm">X</span>
          </button>
        </div>

        <div className="pt-8 border-t border-white/5 text-center space-y-2">
          <p className="text-[10px] text-teal-100/30">© 2025 JifeLog. All rights reserved.</p>
          <p className="text-[10px] text-teal-100/20">Powered by Readdy</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
