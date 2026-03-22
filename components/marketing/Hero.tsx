import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles } from 'lucide-react';

interface HeroProps {
  onSignup: () => void;
  onExplore: () => void;
}

const heroShots = [
  '/feed_mockup.png',
  '/bookmark_mockup.png',
  '/schedule_mockup.png',
];

const Hero: React.FC<HeroProps> = ({ onSignup, onExplore }) => {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#06131a] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.22),transparent_34%),radial-gradient(circle_at_80%_18%,rgba(56,189,248,0.18),transparent_28%),linear-gradient(180deg,#07141b_0%,#081019_44%,#0f172a_100%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.28)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] [background-size:80px_80px]" />
      <div className="absolute left-[-10%] top-[18%] h-64 w-64 rounded-full bg-teal-400/18 blur-3xl" />
      <div className="absolute bottom-[10%] right-[-6%] h-72 w-72 rounded-full bg-cyan-400/12 blur-3xl" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-screen-2xl flex-col justify-center px-6 pb-14 pt-28 md:px-10 lg:grid lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] lg:gap-10 lg:px-12 lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-semibold tracking-[0.24em] text-teal-200 uppercase backdrop-blur">
            <Sparkles size={14} />
            JifeLog
          </div>

          <h1 className="max-w-[10ch] text-[clamp(3.4rem,10vw,7.4rem)] font-black leading-[0.88] tracking-[-0.06em] text-white">
            하루를
            <br />
            이어주는
            <br />
            기록 시스템
          </h1>

          <p className="mt-6 max-w-md text-base leading-7 text-slate-300 md:text-lg">
            기록, 저장, 일정, 회고까지. 흩어진 하루를 하나의 흐름으로 정리하는 개인 라이프 OS.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={onSignup}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-400 px-6 py-3.5 text-sm font-black text-slate-950 transition-all hover:bg-teal-300 hover:shadow-[0_18px_60px_rgba(45,212,191,0.28)]"
            >
              무료로 시작하기
              <ArrowRight size={16} />
            </button>
            <button
              onClick={onExplore}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/14 bg-white/6 px-6 py-3.5 text-sm font-semibold text-white/88 backdrop-blur transition-colors hover:bg-white/10"
            >
              <Play size={15} />
              둘러보기
            </button>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-6 text-left">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Capture</p>
              <p className="mt-2 text-sm font-semibold text-slate-200">사진과 글로 남기는 하루</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Organize</p>
              <p className="mt-2 text-sm font-semibold text-slate-200">북마크와 일정의 연결</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Reflect</p>
              <p className="mt-2 text-sm font-semibold text-slate-200">AI가 정리하는 하루의 맥락</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 32 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-14 lg:mt-0"
        >
          <div className="relative mx-auto max-w-3xl lg:ml-auto lg:mr-0">
            <div className="absolute left-[12%] top-[16%] h-52 w-52 rounded-full bg-teal-300/18 blur-3xl" />
            <div className="absolute right-[8%] top-[6%] h-40 w-40 rounded-full bg-cyan-300/14 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/6 p-3 shadow-[0_30px_120px_rgba(0,0,0,0.42)] backdrop-blur-sm">
              <div className="rounded-[1.6rem] border border-white/8 bg-[#0a111d] p-3">
                <div className="mb-3 flex items-center justify-between rounded-[1.1rem] border border-white/8 bg-white/[0.04] px-4 py-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-teal-200/80">Today flow</p>
                    <p className="mt-1 text-lg font-bold text-white">한곳에서 이어지는 나의 하루</p>
                  </div>
                  <div className="rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1 text-xs font-semibold text-teal-100">
                    Synced
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-[1.4fr_0.8fr]">
                  <div className="overflow-hidden rounded-[1.3rem] border border-white/8 bg-[#0f1728]">
                    <img src="/feed_mockup.png" alt="JifeLog feed preview" className="h-full w-full object-cover" />
                  </div>
                  <div className="grid gap-3">
                    {heroShots.slice(1).map((shot) => (
                      <div key={shot} className="overflow-hidden rounded-[1.3rem] border border-white/8 bg-[#0f1728]">
                        <img src={shot} alt="JifeLog preview" className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="absolute -bottom-6 right-2 max-w-[220px] rounded-[1.4rem] border border-white/10 bg-slate-950/80 p-4 shadow-[0_20px_70px_rgba(0,0,0,0.45)] backdrop-blur-md"
            >
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">AI recap</p>
              <p className="mt-2 text-sm font-semibold text-white">오늘 저장한 정보와 일정, 기록을 한 번에 요약합니다.</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
