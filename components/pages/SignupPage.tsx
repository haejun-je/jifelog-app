import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, User, Check, AlertCircle } from 'lucide-react';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

  const handleSignup = () => {
    if (!name || !email || !password || !confirmPassword || passwordError || !agreedToTerms || !isEmailValid) {
      return;
    }
    // Perform signup logic here
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col relative overflow-hidden text-slate-200">
      {/* Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-teal-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]" />

      <div className="max-w-md w-full mx-auto p-6 relative z-10 flex-1 flex flex-col justify-center">
        {/* Navigation */}
        <div className="absolute top-6 left-6">
          <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">돌아가기</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-16 mt-16">
          <h1 className="text-3xl font-black text-white mb-2">회원가입</h1>
          <p className="text-slate-400 text-sm">JifeLog와 함께 새로운 여정을 시작하세요</p>
        </div>

        {/* Form Card */}
        <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl transition-all duration-700 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="space-y-5">

            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 ml-1">이름</label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="당신의 이름"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 transition-all"
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-500 transition-colors" size={18} />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 ml-1">이메일</label>
              <div className="flex gap-2">
                <div className="relative flex-1 group">
                  <input
                    type="email"
                    placeholder="이메일 주소"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isCodeSent}
                    className={`w-full pl-11 pr-4 py-3.5 bg-slate-800/50 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-4 transition-all disabled:opacity-50 ${!isEmailValid && email
                      ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/10'
                      : 'border-slate-700/50 focus:border-teal-500/50 focus:ring-teal-500/10'
                      }`}
                  />
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${!isEmailValid && email ? 'text-red-500' : 'text-slate-500 group-focus-within:text-teal-500'}`} size={18} />
                </div>
                {!isCodeVerified && (
                  <button
                    onClick={() => setIsCodeSent(true)}
                    disabled={isCodeSent || !isEmailValid || !email}
                    className="px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold text-xs transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    인증요청
                  </button>
                )}
              </div>
            </div>

            {/* Verification Code */}
            {isCodeSent && !isCodeVerified && (
              <div className="animate-fade-in-down">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="인증번호"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 transition-all"
                  />
                  <button
                    onClick={() => setIsCodeVerified(true)}
                    className="px-4 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold text-xs transition-colors whitespace-nowrap"
                  >
                    확인
                  </button>
                </div>
              </div>
            )}

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 ml-1">비밀번호</label>
              <div className="relative group">
                <input
                  type="password"
                  placeholder="8자 이상 입력해주세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-11 pr-4 py-3.5 bg-slate-800/50 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-4 transition-all ${passwordError ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/10' : 'border-slate-700/50 focus:border-teal-500/50 focus:ring-teal-500/10'
                    }`}
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-500 transition-colors" size={18} />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 ml-1">비밀번호 확인</label>
              <div className="relative group">
                <input
                  type="password"
                  placeholder="비밀번호를 한번 더 입력해주세요"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-11 pr-4 py-3.5 bg-slate-800/50 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-4 transition-all ${passwordError ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/10' : 'border-slate-700/50 focus:border-teal-500/50 focus:ring-teal-500/10'
                    }`}
                />
                <Check className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${password && !passwordError ? 'text-teal-500' : 'text-slate-500'}`} size={18} />
              </div>
              {passwordError && (
                <p className="flex items-center gap-1 text-red-500 text-xs ml-1">
                  <AlertCircle size={12} /> 비밀번호가 일치하지 않습니다
                </p>
              )}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 p-1 cursor-pointer group">
              <div className="relative flex items-center mt-0.5">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="w-5 h-5 border-2 border-slate-600 rounded bg-slate-800/50 peer-checked:bg-teal-500 peer-checked:border-teal-500 transition-all"></div>
                <Check size={14} className="absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
              <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed">
                <span className="text-teal-400 font-bold hover:underline">서비스 이용약관</span> 및 <span className="text-teal-400 font-bold hover:underline">개인정보 처리방침</span>을<br />확인하였으며 이에 동의합니다.
              </span>
            </label>

            {/* Submit Button */}
            <button
              onClick={handleSignup}
              disabled={!name || !email || !password || !confirmPassword || passwordError || !agreedToTerms || !isEmailValid || !isCodeVerified}
              className="w-full py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white font-bold rounded-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed text-sm"
            >
              회원가입
            </button>

            {/* Divider */}
            {/*            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-slate-500">
                <span className="bg-[#0f172a] px-3">Start with Social</span>
              </div>
            </div>
*/}
            {/* Social Buttons */}
            {/*             <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl border border-white/5 transition-colors text-xs font-bold">
                <img src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg" className="w-4 h-4" alt="Google" />
                Google
              </button>
              <button className="flex items-center justify-center gap-2 bg-[#FEE500] hover:bg-[#FADA00] text-[#3C1E1E] py-3 rounded-xl transition-colors text-xs font-bold">
                <div className="w-4 h-4 flex items-center justify-center">💬</div>
                Kakao
              </button>
            </div>}
*/}
            {/* Login Link */}
            <div className="text-center">
              <p className="text-xs text-slate-500">
                이미 계정이 있으신가요? <Link to="/login" className="text-teal-400 font-bold hover:text-teal-300 transition-colors">로그인하기</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
