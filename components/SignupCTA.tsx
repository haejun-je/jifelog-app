import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface SignupCTAProps {
  onSignup: () => void;
  onLogin: () => void;
}

const SignupCTA: React.FC<SignupCTAProps> = ({ onSignup, onLogin }) => {
  return (
    <div className="relative overflow-hidden rounded-[40px] p-10 md:p-14 text-center group">
      {/* Background Gradient & Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-slate-900 to-slate-900 z-0"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(45,212,191,0.2),transparent_70%)] z-0"></div>
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl z-0"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl z-0"></div>

      <div className="relative z-10 max-w-lg mx-auto">


        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
          당신의 이야기를<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-teal-400">지금 시작하세요</span>
        </h2>

        <p className="text-slate-300 text-base md:text-lg mb-12 leading-relaxed">
          JifeLog와 함께라면 일상이 더 특별해집니다.<br />
          지금 바로 나만의 공간을 만들어보세요.
        </p>

        <div className="space-y-4 max-w-sm mx-auto">
          <button
            onClick={onSignup}
            className="w-full py-4 bg-white hover:bg-teal-50 text-teal-900 font-black text-lg rounded-2xl shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-2 group/btn"
          >
            이메일로 시작하기
            <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button className="py-3.5 bg-[#2d333b] hover:bg-[#373e48] text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 border border-white/5 transition-colors">
              <img src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg" className="w-5 h-5" alt="Google" />
              Google
            </button>
            <button className="py-3.5 bg-[#fee500] hover:bg-[#fdd800] text-[#3c1e1e] text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
              <div className="w-5 h-5 flex items-center justify-center text-lg">💬</div>
              Kakao
            </button>
          </div>

          <div className="pt-4">
            <button
              onClick={onLogin}
              className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
            >
              이미 계정이 있으신가요? <span className="underline decoration-teal-500/50 underline-offset-4 decoration-2">로그인하기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupCTA;
