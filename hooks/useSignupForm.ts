import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError, sendEmailVerification, verifyEmailCode, signup } from '../api/auth';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TIMER_DURATION = 600;

function validateEmail(value: string): boolean {
  return EMAIL_REGEX.test(value);
}

function validatePassword(value: string): string {
  if (value.length < 6) return '비밀번호는 6자 이상이어야 합니다.';
  if (!/[a-zA-Z]/.test(value)) return '영문자를 포함해야 합니다.';
  if (!/[0-9]/.test(value)) return '숫자를 포함해야 합니다.';
  return '';
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function useSignupForm() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [timerActive, setTimerActive] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);

  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [passwordValidError, setPasswordValidError] = useState('');

  const [isRequestingCode, setIsRequestingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const [codeError, setCodeError] = useState('');
  const [signupError, setSignupError] = useState('');

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 이메일 유효성 검사
  useEffect(() => {
    setIsEmailValid(email ? validateEmail(email) : true);
  }, [email]);

  // 비밀번호 형식 검사
  useEffect(() => {
    setPasswordValidError(password ? validatePassword(password) : '');
  }, [password]);

  // 비밀번호 일치 검사
  useEffect(() => {
    setPasswordMismatch(Boolean(password && confirmPassword && password !== confirmPassword));
  }, [password, confirmPassword]);

  // 인증 타이머
  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setTimerActive(false);
            setIsTimedOut(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive]);

  // 파생 상태
  const hasName = name.trim().length > 0;
  const hasEmail = email.trim().length > 0;
  const canRequestCode = hasName && hasEmail && isEmailValid && !isCodeVerified;
  const canShowEmail = hasName;
  const canShowVerification = canShowEmail && hasEmail && isEmailValid && isCodeSent && !isCodeVerified;
  const canShowPassword = isCodeVerified;
  const canShowConfirmPassword = canShowPassword && password.length > 0 && passwordValidError === '';
  const canShowTerms =
    canShowConfirmPassword && confirmPassword.length > 0 && !passwordMismatch;
  const isFormComplete =
    hasName &&
    hasEmail &&
    isEmailValid &&
    isCodeVerified &&
    password.length > 0 &&
    confirmPassword.length > 0 &&
    !passwordMismatch &&
    passwordValidError === '' &&
    agreedToTerms;

  // 핸들러
  async function handleRequestCode() {
    if (!canRequestCode || isRequestingCode) return;
    setIsRequestingCode(true);
    setCodeError('');
    try {
      await sendEmailVerification(email);
      setIsCodeSent(true);
      setVerificationCode('');
      setTimeLeft(TIMER_DURATION);
      setIsTimedOut(false);
      setTimerActive(true);
    } catch (err) {
      setCodeError(err instanceof ApiError ? err.message : '네트워크 오류가 발생했습니다.');
    } finally {
      setIsRequestingCode(false);
    }
  }

  async function handleVerifyCode() {
    if (verificationCode.length !== 16 || isTimedOut || isVerifyingCode) return;
    setIsVerifyingCode(true);
    setCodeError('');
    try {
      await verifyEmailCode(email, verificationCode);
      setIsCodeVerified(true);
      setTimerActive(false);
    } catch (err) {
      setCodeError(err instanceof ApiError ? err.message : '네트워크 오류가 발생했습니다.');
    } finally {
      setIsVerifyingCode(false);
    }
  }

  async function handleSignup() {
    if (!isFormComplete || isSigningUp) return;
    setIsSigningUp(true);
    setSignupError('');
    try {
      await signup(email, name, password);
      navigate('/login');
    } catch (err) {
      setSignupError(err instanceof ApiError ? err.message : '네트워크 오류가 발생했습니다.');
    } finally {
      setIsSigningUp(false);
    }
  }

  return {
    // 입력 상태
    name, setName,
    email, setEmail,
    isEmailValid,
    verificationCode, setVerificationCode,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    agreedToTerms, setAgreedToTerms,

    // 인증 상태
    isCodeSent,
    isCodeVerified,
    timeLeft,
    isTimedOut,

    // 유효성 에러
    passwordMismatch,
    passwordValidError,

    // 로딩 상태
    isRequestingCode,
    isVerifyingCode,
    isSigningUp,

    // API 에러 메시지
    codeError,
    signupError,

    // 파생 상태 (UI 표시 조건)
    canRequestCode,
    canShowEmail,
    canShowVerification,
    canShowPassword,
    canShowConfirmPassword,
    canShowTerms,
    isFormComplete,

    // 핸들러
    handleRequestCode,
    handleVerifyCode,
    handleSignup,
  };
}
