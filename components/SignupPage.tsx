
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sun } from 'lucide-react'; // Added Sun icon for theme toggle

const SignupPage: React.FC = () => {
  // Removed isCodeSent and isCodeVerified states as per new design
  const [name, setName] = useState(''); // New state for name
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false); // New state for terms checkbox
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
      setIsEmailValid(true); // Treat empty email as valid initially or adjust as needed
    }
  }, [email]);

  React.useEffect(() => {
    if (password && confirmPassword && password !== confirmPassword) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  }, [password, confirmPassword]);

  // Combined logic for form submission (replace with actual API call)
  const handleSignup = () => {
    if (!name || !email || !password || !confirmPassword || passwordError || !agreedToTerms || !isEmailValid) {
      alert('모든 필드를 올바르게 입력하고 약관에 동의해주세요.');
      return;
    }
    // Perform signup logic here
    alert('회원가입 성공!');
    // navigate('/'); // Redirect after signup
  };

  return (
    <div className="min-h-screen bg-[#242A38] text-white"> {/* Overall darker background */}
      <div className="max-w-screen-md mx-auto p-5"> {/* Container for main content */}
        {/* Top Header-like section */}
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">홈으로 돌아가기</span>
          </Link>
          <button className="text-yellow-400 hover:text-yellow-300 transition-colors">
            <Sun className="w-6 h-6" />
          </button>
        </div>

        {/* JifeLog Title and Subtitle */}
        <div className="text-center my-8">
          <h1 className="text-4xl font-black text-white">JifeLog</h1>
          <p className="text-gray-400 text-sm mt-2">새로운 여정을 시작하세요</p>
        </div>

        {/* Main form container */}
        <div className={`bg-[#1E2530] rounded-3xl p-8 shadow-xl border border-white/5 max-w-md mx-auto transition-opacity duration-700 ${isMounted ? 'opacity-100' : 'opacity-0'}`}> {/* Slightly lighter dark grey */}
          <h2 className="text-2xl font-black text-white mb-8">회원가입</h2>

          <div className="space-y-6"> {/* Increased space between form groups */}
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">이름</label>
              <input
                id="name"
                type="text"
                placeholder="홍길동"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-4 bg-[#2C3545] border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500/50 transition-all"
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">이메일</label>
              <div className="flex gap-2">
                <input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-5 py-4 bg-[#2C3545] border rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500/50 transition-all disabled:opacity-50 ${
                    !isEmailValid && email ? 'border-red-500' : 'border-white/10'
                  }`}
                  disabled={isCodeSent}
                />
                {!isCodeVerified && (
                  <button 
                    onClick={() => setIsCodeSent(true)}
                    disabled={isCodeSent || !isEmailValid || !email}
                    className="w-32 bg-slate-600 text-white py-2 rounded-xl font-bold text-xs hover:bg-slate-500 transition-colors disabled:opacity-50"
                  >
                    인증번호 발송
                  </button>
                )}
              </div>
              {!isEmailValid && email && (
                <p className="text-red-500 text-xs mt-1 px-1">
                  유효하지 않은 이메일 형식입니다.
                </p>
              )}
            </div>

            {/* Verification Code Input */}
            <div className="grid transition-[grid-template-rows] duration-500 ease-in-out" style={{gridTemplateRows: isCodeSent ? '1fr' : '0fr'}}>
              <div className="overflow-hidden">
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="인증번호 6자리"
                    className="w-full px-5 py-4 bg-[#2C3545] border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500/50 transition-all disabled:opacity-50"
                    disabled={isCodeVerified}
                  />
                  <button
                    onClick={() => setIsCodeVerified(true)}
                    className="w-32 bg-teal-600 text-white py-2 rounded-xl font-bold text-xs hover:bg-teal-700 transition-colors disabled:opacity-50"
                    disabled={isCodeVerified}
                  >
                    {isCodeVerified ? '인증 완료' : '인증 확인'}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">비밀번호</label>
              <input
                id="password"
                type="password"
                placeholder="최소 8자 이상"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-5 py-4 bg-[#2C3545] border rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500/50 transition-all ${passwordError ? 'border-red-500' : 'border-white/10'}`}
              />
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">비밀번호 확인</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-5 py-4 bg-[#2C3545] border rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500/50 transition-all ${passwordError ? 'border-red-500' : 'border-white/10'}`}
              />
              {passwordError && <p className="text-red-500 text-xs mt-1 px-1">비밀번호가 일치하지 않습니다.</p>}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center pt-2">
              <input 
                id="terms" 
                type="checkbox" 
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 text-teal-600 bg-gray-700 border-gray-600 rounded focus:ring-teal-500"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-300">
                이용약관 및 <span className="text-teal-400 underline underline-offset-2">개인정보처리방침</span>에 동의합니다
              </label>
            </div>

            {/* Signup Button */}
            <button 
              onClick={handleSignup}
              disabled={!name || !email || !password || !confirmPassword || passwordError || !agreedToTerms || !isEmailValid || !isCodeVerified}
              className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              회원가입
            </button>
            
            {/* OR Separator */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#1E2530] px-4 text-gray-400 font-medium">또는</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <button className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 py-3.5 rounded-xl font-bold hover:bg-gray-100 transition-colors">
              <img src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg" className="w-5 h-5" alt="Google" />
              Google로 계속하기
            </button>
            <button className="w-full flex items-center justify-center gap-3 bg-[#FEE500] text-[#3C1E1E] py-3.5 rounded-xl font-bold hover:bg-[#FADA00] transition-colors">
              <img src="https://developers.kakao.com/assets/img/about/logos/kakaologin/kr/01_2_PMS_KR.png" className="w-5 h-5" alt="Kakao" /> {/* Kakao icon */}
              카카오로 계속하기
            </button>
          </div>

          {/* Login Link */}
          <div className="mt-8 text-center text-sm">
            <span className="text-gray-400">이미 계정이 있으신가요? </span>
            <Link to="/login" className="text-teal-400 font-semibold hover:underline">로그인</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;




