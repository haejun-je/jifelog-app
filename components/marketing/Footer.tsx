import React from 'react';
import { Instagram, Facebook, Youtube, Twitter, Mail, ArrowRight } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 pt-20 pb-10 px-6">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">

          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1 space-y-6">
            <div className="w-32">
              <img src="/logo.png" alt="JifeLog Logo" className="w-full h-auto drop-shadow-lg" />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              당신의 소중한 순간들을 기록하고,<br />
              삶의 여정을 아름답게 완성하세요.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <button key={i} className="text-slate-400 hover:text-teal-400 transition-colors">
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-lg">Product</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><button className="hover:text-teal-400 transition-colors">주요 기능</button></li>
              <li><button className="hover:text-teal-400 transition-colors">요금제</button></li>
              <li><button className="hover:text-teal-400 transition-colors">업데이트</button></li>
              <li><button className="hover:text-teal-400 transition-colors">모바일 앱</button></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-lg">Company</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><button className="hover:text-teal-400 transition-colors">소개</button></li>
              <li><button className="hover:text-teal-400 transition-colors">채용</button></li>
              <li><button className="hover:text-teal-400 transition-colors">블로그</button></li>
              <li><button className="hover:text-teal-400 transition-colors">문의하기</button></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-lg">Newsletter</h4>
            <p className="text-slate-400 text-sm">
              최신 소식과 팁을 매주 받아보세요.
            </p>
            <div className="flex flex-col gap-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="이메일 주소"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 pl-10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-sm"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              </div>
              <button className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
                구독하기 <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs">
            © 2025 JifeLog Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-slate-500 text-xs">
            <button className="hover:text-white transition-colors">개인정보처리방침</button>
            <button className="hover:text-white transition-colors">이용약관</button>
            <button className="hover:text-white transition-colors">쿠키 설정</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
