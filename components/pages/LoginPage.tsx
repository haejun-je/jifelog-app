
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock } from 'lucide-react';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleLogin = () => {
        if (!email || !password) return;
        // Perform login logic
        console.log('Login attempt', { email, password });
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col relative overflow-hidden text-slate-200">
            {/* Background Effects */}
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-teal-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]" />

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
                <div className="text-center mb-12 mt-8">
                    <h1 className="text-3xl font-black text-white mb-2">다시 오신 걸 환영해요</h1>
                    <p className="text-slate-400 text-sm">JifeLog와 함께 당신의 소중한 순간을 기록하세요</p>
                </div>

                {/* Form Card */}
                <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl transition-all duration-700 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className="space-y-6">

                        {/* Social Login - Placeholder based on AuthModal */}
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

                        {/* Email Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 ml-1">이메일</label>
                            <div className="relative group">
                                <input
                                    type="email"
                                    placeholder="이메일 주소"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 transition-all"
                                />
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-500 transition-colors" size={18} />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-bold text-slate-400">비밀번호</label>
                                <button className="text-[10px] text-teal-400 hover:underline">비밀번호를 잊으셨나요?</button>
                            </div>
                            <div className="relative group">
                                <input
                                    type="password"
                                    placeholder="비밀번호"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 transition-all"
                                />
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-500 transition-colors" size={18} />
                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            onClick={handleLogin}
                            className="w-full py-4 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl shadow-lg shadow-teal-500/20 active:scale-[0.98] transition-all text-sm mt-4"
                        >
                            로그인
                        </button>

                        {/* Sign Up Link */}
                        <div className="text-center pt-2">
                            <p className="text-xs text-slate-500">
                                계정이 없으신가요? <Link to="/signup" className="text-teal-400 font-bold hover:text-teal-300 transition-colors">회원가입하기</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
