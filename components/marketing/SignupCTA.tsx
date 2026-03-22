import React from 'react';
import { ArrowRight } from 'lucide-react';

interface SignupCTAProps {
  onSignup: () => void;
  onLogin: () => void;
}

const SignupCTA: React.FC<SignupCTAProps> = ({ onSignup, onLogin }) => {
  return (
    <section className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-[linear-gradient(135deg,#08141b_0%,#0f172a_48%,#111827_100%)] px-6 py-12 shadow-[0_30px_120px_rgba(2,6,23,0.45)] md:px-10 md:py-16">
      <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-300">Start now</p>
          <h2 className="mt-4 max-w-[11ch] text-4xl font-black tracking-[-0.05em] text-white md:text-6xl">
            기록하던 하루를 이제 연결하세요
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 md:text-lg">
            JifeLog는 예쁜 기록에서 끝나지 않습니다. 저장한 정보와 일정, 회고까지 한 흐름으로 이어지는 나만의 라이프 시스템을 시작하세요.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onSignup}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-teal-400 px-6 py-4 text-base font-black text-slate-950 transition-all hover:bg-teal-300 hover:shadow-[0_20px_60px_rgba(45,212,191,0.28)]"
          >
            무료로 시작하기
            <ArrowRight size={18} />
          </button>
          <button
            onClick={onLogin}
            className="w-full rounded-full border border-white/12 bg-white/[0.04] px-6 py-4 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/[0.08] hover:text-white"
          >
            이미 계정이 있다면 로그인
          </button>
          <p className="px-2 pt-3 text-xs leading-5 text-slate-500">
            이메일로 바로 시작할 수 있고, 소셜 로그인 확장은 후속 단계에서 정리합니다.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SignupCTA;
