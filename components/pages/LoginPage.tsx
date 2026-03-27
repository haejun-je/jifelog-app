import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, Lock, Mail } from 'lucide-react';
import { ApiError, login } from '../../api/auth';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(value: string): boolean {
  return EMAIL_REGEX.test(value);
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    setIsEmailValid(email ? validateEmail(email) : true);
  }, [email]);

  const handleLogin = async () => {
    if (!email || !password || !isEmailValid || isLoggingIn) {
      return;
    }

    setIsLoggingIn(true);
    setLoginError('');

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setLoginError(err instanceof ApiError ? err.message : '네트워크 오류가 발생했습니다.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#061019] text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.16),transparent_26%),radial-gradient(circle_at_86%_14%,rgba(56,189,248,0.14),transparent_24%),linear-gradient(180deg,#071019_0%,#0b1320_52%,#111827_100%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="absolute left-[-12%] top-[8%] h-72 w-72 rounded-full bg-teal-400/14 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-8%] h-80 w-80 rounded-full bg-cyan-400/12 blur-[140px]" />

      <div className="relative mx-auto flex min-h-screen max-w-screen-xl flex-col px-5 pb-10 pt-6 md:px-8 lg:px-10">
        <div className="flex items-center justify-between">
          <Link to="/" className="group inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition-colors group-hover:bg-white/[0.08]">
              <ArrowLeft className="h-4 w-4" />
            </div>
            돌아가기
          </Link>
          <p className="hidden text-xs uppercase tracking-[0.28em] text-slate-500 md:block">JifeLog</p>
        </div>

        <div className="flex flex-1 items-center py-10 md:py-14">
          <div className="grid w-full gap-12 lg:grid-cols-[0.9fr_minmax(0,560px)] lg:gap-20">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-xl self-start lg:self-center"
            >
          {/*    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-teal-200 backdrop-blur">
                <Sparkles size={14} />
                JifeLog Login
              </div>*/}

              <h1 className="mt-6 max-w-[10ch] text-4xl font-black leading-[0.94] tracking-[-0.06em] text-white md:text-6xl">
                다시 돌아온 하루를 바로 이어가세요
              </h1>
              {/* <p className="mt-5 max-w-md text-base leading-7 text-slate-300 md:text-lg">
                저장해 둔 기록과 일정, 파일을 다시 불러옵니다. 로그인 후 바로 이어서 사용할 수 있습니다.
              </p>
              <p className="mt-10 max-w-sm text-sm leading-6 text-slate-500">
                이메일과 비밀번호만 입력하면 됩니다. 필요한 액션만 남긴 간결한 로그인 화면으로 빠르게 진입하세요.
              </p> */}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-none lg:max-w-[560px]"
            >
              <div className="border-b border-white/8 pb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-300">Sign in</p>
                <h2 className="mt-3 text-2xl font-black tracking-[-0.05em] text-white md:text-3xl">
                  이메일과 비밀번호로 로그인
                </h2>
              </div>

              <div className="mt-8 space-y-7">
                <div className="space-y-1.5">
                  <label className="ml-1 text-xs font-bold text-slate-400">이메일</label>
                  <div className="relative group">
                    <input
                      type="email"
                      placeholder="이메일 주소"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full border-0 border-b bg-transparent py-4 pl-11 pr-1 text-base text-white placeholder-slate-500 transition-all focus:outline-none ${
                        !isEmailValid && email
                          ? 'border-red-500/60 focus:border-red-500'
                          : 'border-white/12 focus:border-teal-400'
                      }`}
                    />
                    <Mail
                      className={`absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 transition-colors ${
                        !isEmailValid && email
                          ? 'text-red-500'
                          : 'text-slate-500 group-focus-within:text-teal-400'
                      }`}
                    />
                  </div>
                  {!isEmailValid && email && (
                    <p className="ml-1 flex items-center gap-1 text-xs text-red-400">
                      <AlertCircle size={12} />
                      올바른 이메일 형식을 입력해주세요
                    </p>
                  )}
                </div>

                <div className="space-y-1.5 pt-7">
                  <div className="ml-1 flex items-center justify-between gap-3">
                    <label className="text-xs font-bold text-slate-400">비밀번호</label>
                    <button className="text-[11px] font-medium text-teal-300 transition-colors hover:text-teal-200">
                      비밀번호를 잊으셨나요?
                    </button>
                  </div>
                  <div className="relative group">
                    <input
                      type="password"
                      placeholder="비밀번호"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border-0 border-b border-white/12 bg-transparent py-4 pl-11 pr-1 text-base text-white placeholder-slate-500 transition-all focus:border-teal-400 focus:outline-none"
                    />
                    <Lock className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-teal-400" />
                  </div>
                </div>

                <div className="space-y-4 pt-7">
                  <button
                    onClick={handleLogin}
                    disabled={!email || !password || !isEmailValid || isLoggingIn}
                    className="w-full rounded-full bg-gradient-to-r from-teal-400 to-teal-500 py-4 text-sm font-black text-slate-950 transition-all hover:from-teal-300 hover:to-teal-400 hover:shadow-[0_18px_50px_rgba(45,212,191,0.22)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-none"
                  >
                    {isLoggingIn ? '로그인 중...' : '로그인'}
                  </button>

                  {loginError && (
                    <p className="flex items-center gap-1 text-xs text-red-400">
                      <AlertCircle size={12} />
                      {loginError}
                    </p>
                  )}

                  <button className="w-full rounded-full border border-white/10 bg-white/[0.04] py-4 text-sm font-semibold text-white transition-colors hover:bg-white/[0.08]">
                    Google로 계속하기
                  </button>
                </div>

                <div className="border-t border-white/8 pt-5 text-left">
                  <p className="text-xs text-slate-500">
                    계정이 없으신가요?{' '}
                    <Link to="/signup" className="font-bold text-teal-300 transition-colors hover:text-teal-200">
                      회원가입하기
                    </Link>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
