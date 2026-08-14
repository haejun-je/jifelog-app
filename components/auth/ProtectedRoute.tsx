import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { status, error } = useAuth();
  const navigate = useNavigate();
  const hasAlertedRef = useRef(false);

  useEffect(() => {
    if (status === 'unauthenticated' && !hasAlertedRef.current) {
      hasAlertedRef.current = true;
      if (error) {
        alert(error);
      }
      navigate('/login', { replace: true });
    }
  }, [status, error, navigate]);

  if (status === 'loading') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-50 dark:bg-[#0f172a] z-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
            세션 확인 중...
          </p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
