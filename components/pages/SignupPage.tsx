import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, Check, Lock, Mail, Sparkles, User } from 'lucide-react';

const revealTransition = {
  duration: 0.38,
  ease: [0.22, 1, 0.36, 1] as const,
};

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  React.useEffect(() => {
    if (email) {
      setIsEmailValid(validateEmail(email));
    } else {
      setIsEmailValid(true);
    }
  }, [email]);

  React.useEffect(() => {
    if (password && confirmPassword && password !== confirmPassword) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  }, [password, confirmPassword]);

  const hasName = name.trim().length > 0;
  const hasEmail = email.trim().length > 0;
  const canRequestCode = hasName && hasEmail && isEmailValid && !isCodeSent;
  const canShowEmail = hasName;
  const canShowVerification = canShowEmail && hasEmail && isEmailValid && isCodeSent && !isCodeVerified;
  const canShowPassword = isCodeVerified;
  const canShowConfirmPassword = canShowPassword && password.length > 0;
  const canShowTerms = canShowConfirmPassword && confirmPassword.length > 0 && !passwordError;
  const isFormComplete = hasName && hasEmail && isEmailValid && isCodeVerified && password.length > 0 && confirmPassword.length > 0 && !passwordError && agreedToTerms;

  const handleSignup = () => {
    if (!isFormComplete) {
      return;
    }

    navigate('/');
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#061019] text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.16),transparent_26%),radial-gradient(circle_at_88%_12%,rgba(56,189,248,0.14),transparent_24%),linear-gradient(180deg,#071019_0%,#0b1320_52%,#111827_100%)]" />
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
            <div className="max-w-xl self-start lg:self-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-teal-200 backdrop-blur">
                <Sparkles size={14} />
                JifeLog Signup
              </div>

              <h1 className="mt-6 max-w-[11ch] text-4xl font-black leading-[0.94] tracking-[-0.06em] text-white md:text-6xl">
                당신의 하루를 연결할 준비를 시작하세요
              </h1>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-none lg:max-w-[560px]"
            >
              <div className="border-b border-white/8 pb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-300">Create account</p>
                <h2 className="mt-3 text-2xl font-black tracking-[-0.05em] text-white md:text-3xl">
                  항목을 차례대로 입력하세요
                </h2>
              </div>

              <div className="mt-8 space-y-7">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={revealTransition}
                  className="space-y-1.5"
                >
                  <label className="ml-1 text-xs font-bold text-slate-400">이름</label>
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="당신의 이름"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border-0 border-b border-white/12 bg-transparent py-4 pl-11 pr-1 text-base text-white placeholder-slate-500 transition-all focus:border-teal-400 focus:outline-none"
                    />
                    <User className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-teal-400" />
                  </div>
                </motion.div>

                <AnimatePresence initial={false}>
                  {canShowEmail && (
                    <motion.div
                      key="email-step"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={revealTransition}
                      className="space-y-1.5 pt-7"
                    >
                      <label className="ml-1 text-xs font-bold text-slate-400">이메일</label>
                      <div className="flex gap-2">
                        <div className="relative flex-1 group">
                          <input
                            type="email"
                            placeholder="이메일 주소"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isCodeSent}
                            className={`w-full border-0 border-b bg-transparent py-4 pl-11 pr-1 text-base text-white placeholder-slate-500 transition-all focus:outline-none disabled:opacity-50 ${!isEmailValid && email
                              ? 'border-red-500/60 focus:border-red-500'
                              : 'border-white/12 focus:border-teal-400'
                              }`}
                          />
                          <Mail className={`absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 transition-colors ${!isEmailValid && email ? 'text-red-500' : 'text-slate-500 group-focus-within:text-teal-400'
                            }`} />
                        </div>
                        {!isCodeVerified && (
                          <button
                            onClick={() => setIsCodeSent(true)}
                            disabled={!canRequestCode}
                            className="whitespace-nowrap self-end rounded-full border border-white/10 bg-white/[0.05] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-white/[0.1] disabled:opacity-50"
                          >
                            인증요청
                          </button>
                        )}
                      </div>
                      {isCodeVerified && (
                        <p className="ml-1 flex items-center gap-1 text-xs text-teal-200">
                          <Check size={12} />
                          이메일 인증이 완료되었습니다
                        </p>
                      )}
                      {!isEmailValid && email && (
                        <p className="ml-1 flex items-center gap-1 text-xs text-red-400">
                          <AlertCircle size={12} />
                          올바른 이메일 형식을 입력해주세요
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence initial={false}>
                  {canShowVerification && (
                    <motion.div
                      key="verification-step"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={revealTransition}
                      className="space-y-1.5 pt-7"
                    >
                      <label className="ml-1 text-xs font-bold text-slate-400">이메일 인증</label>
                      <div className="flex gap-2">
                        <div className="relative flex-1 group">
                          <input
                            type="text"
                            placeholder="인증번호"
                            className="w-full border-0 border-b border-white/12 bg-transparent py-4 pl-11 pr-1 text-base text-white placeholder-slate-500 transition-all focus:border-teal-400 focus:outline-none"
                          />
                          <Check className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-teal-400" />
                        </div>
                        <button
                          onClick={() => setIsCodeVerified(true)}
                          className="whitespace-nowrap self-end rounded-full bg-teal-400 px-4 py-2.5 text-xs font-bold text-slate-950 transition-colors hover:bg-teal-300"
                        >
                          확인
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence initial={false}>
                  {canShowPassword && (
                    <motion.div
                      key="password-step"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={revealTransition}
                      className="space-y-6 pt-7"
                    >
                      <div className="space-y-1.5">
                        <label className="ml-1 text-xs font-bold text-slate-400">비밀번호</label>
                        <div className="relative group">
                          <input
                            type="password"
                            placeholder="8자 이상 입력해주세요"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full border-0 border-b bg-transparent py-4 pl-11 pr-1 text-base text-white placeholder-slate-500 transition-all focus:outline-none ${passwordError
                              ? 'border-red-500/60 focus:border-red-500'
                              : 'border-white/12 focus:border-teal-400'
                              }`}
                          />
                          <Lock className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-teal-400" />
                        </div>
                      </div>

                      <AnimatePresence initial={false}>
                        {canShowConfirmPassword && (
                          <motion.div
                            key="confirm-step"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={revealTransition}
                            className="space-y-1.5"
                          >
                            <label className="ml-1 text-xs font-bold text-slate-400">비밀번호 확인</label>
                            <div className="relative group">
                              <input
                                type="password"
                                placeholder="비밀번호를 한번 더 입력해주세요"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`w-full border-0 border-b bg-transparent py-4 pl-11 pr-1 text-base text-white placeholder-slate-500 transition-all focus:outline-none ${passwordError
                                  ? 'border-red-500/60 focus:border-red-500'
                                  : 'border-white/12 focus:border-teal-400'
                                  }`}
                              />
                              <Check className={`absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 transition-colors ${password && confirmPassword && !passwordError ? 'text-teal-400' : 'text-slate-500'
                                }`} />
                            </div>
                            {passwordError && (
                              <p className="ml-1 flex items-center gap-1 text-xs text-red-400">
                                <AlertCircle size={12} />
                                비밀번호가 일치하지 않습니다
                              </p>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence initial={false}>
                  {canShowTerms && (
                    <motion.div
                      key="terms-step"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={revealTransition}
                      className="space-y-5 pt-7"
                    >
                      <label className="group flex cursor-pointer items-start gap-3">
                        <div className="relative mt-0.5 flex items-center">
                          <input
                            type="checkbox"
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                            className="peer sr-only"
                          />
                          <div className="h-5 w-5 rounded border-2 border-slate-600 bg-slate-800/50 transition-all peer-checked:border-teal-500 peer-checked:bg-teal-500" />
                          <Check size={14} className="absolute inset-0 m-auto text-white opacity-0 transition-opacity peer-checked:opacity-100" />
                        </div>
                        <span className="text-xs leading-relaxed text-slate-400 transition-colors group-hover:text-slate-300">
                          <span className="font-bold text-teal-300 hover:underline">서비스 이용약관</span> 및{' '}
                          <span className="font-bold text-teal-300 hover:underline">개인정보 처리방침</span>을 확인하였으며 이에 동의합니다.
                        </span>
                      </label>

                      <button
                        onClick={handleSignup}
                        disabled={!isFormComplete}
                        className="w-full rounded-full bg-gradient-to-r from-teal-400 to-teal-500 py-4 text-sm font-black text-slate-950 transition-all hover:from-teal-300 hover:to-teal-400 hover:shadow-[0_18px_50px_rgba(45,212,191,0.22)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-none"
                      >
                        회원가입
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="border-t border-white/8 pt-5 text-left">
                  <p className="text-xs text-slate-500">
                    이미 계정이 있으신가요?{' '}
                    <Link to="/login" className="font-bold text-teal-300 transition-colors hover:text-teal-200">
                      로그인하기
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

export default SignupPage;
