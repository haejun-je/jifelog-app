
import React from 'react';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-sm bg-[#1e293b] rounded-[40px] p-8 shadow-2xl animate-in fade-in zoom-in duration-200 border border-white/5">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/20">
            <span className="text-white font-black text-2xl leading-none">J</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            다시 오신 걸 환영해요
          </h2>
          <p className="text-gray-400 text-xs mt-2 font-medium opacity-80">
            JifeLog와 함께 당신의 소중한 순간을 기록하세요.
          </p>
        </div>

        <div className="space-y-4">
          <button className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 py-3.5 rounded-2xl font-bold hover:bg-gray-100 transition-colors">
            <img src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg" className="w-5 h-5" alt="Google" />
            Google로 계속하기
          </button>
          
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-[10px]">
              <span className="bg-[#1e293b] px-3 text-gray-500 font-black tracking-widest uppercase">또는</span>
            </div>
          </div>

          <div className="space-y-3">
            <input 
              type="email" 
              placeholder="이메일 주소"
              className="w-full px-5 py-4 bg-slate-800/50 border border-white/5 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:bg-slate-800 transition-all"
            />
            <input 
              type="password" 
              placeholder="비밀번호"
              className="w-full px-5 py-4 bg-slate-800/50 border border-white/5 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:bg-slate-800 transition-all"
            />
          </div>

          <button className="w-full bg-teal-500 text-white py-4 rounded-2xl font-black active:scale-95 transition-transform mt-2">
            로그인
          </button>
        </div>

        <div className="mt-8 text-center text-[10px] text-gray-500 font-medium">
          계속함으로써 JifeLog의 <span className="text-teal-400 underline underline-offset-2">이용약관</span> 및 <br />
          <span className="text-teal-400 underline underline-offset-2">개인정보처리방침</span>에 동의하게 됩니다.
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
