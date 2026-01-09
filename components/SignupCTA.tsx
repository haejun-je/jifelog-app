
import React from 'react';

interface SignupCTAProps {
  onSignup: () => void;
  onLogin: () => void;
}

const SignupCTA: React.FC<SignupCTAProps> = ({ onSignup, onLogin }) => {
  return (
    <div className="bg-teal-700/60 rounded-[40px] p-10 text-center border border-teal-500/20">
      <h2 className="text-3xl font-black text-white mb-3">지금 시작하세요</h2>
      <p className="text-teal-100 text-sm mb-10 opacity-80">당신의 삶의 여정을 기록할 준비가 되셨나요?</p>

      <div className="space-y-3 max-w-xs mx-auto">
        <button 
          onClick={onSignup}
          className="w-full py-4 bg-white text-teal-800 font-black rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-transform"
        >
          회원가입
        </button>
        <button 
          onClick={onLogin}
          className="w-full py-4 bg-teal-900/40 text-white font-black rounded-2xl border border-white/10 hover:bg-teal-900/60 transition-colors"
        >
          로그인
        </button>
        
        <div className="flex items-center gap-2 py-4">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="text-[10px] text-teal-200/50 font-bold uppercase">또는</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        <button className="w-full py-3.5 bg-[#2d333b] text-white text-sm font-bold rounded-2xl flex items-center justify-center gap-3 border border-white/5">
          <img src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg" className="w-4 h-4" alt="" />
          Google로 계속하기
        </button>
        <button className="w-full py-3.5 bg-[#fee500] text-[#3c1e1e] text-sm font-bold rounded-2xl flex items-center justify-center gap-3">
          <div className="w-5 h-5 flex items-center justify-center">💬</div>
          카카오로 계속하기
        </button>
      </div>
    </div>
  );
};

export default SignupCTA;
