import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getMyAccount, AccountMeResponse, ApiError } from '../api/account';
import { setUnauthorizedHandler } from '../api/httpClient';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthContextValue {
  user: AccountMeResponse | null;
  status: AuthStatus;
  error: string | null;
  refetch: () => Promise<void>;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * 마지막 /me 성공 시각으로부터 이 시간 이내의 페이지 이동에서는 재호출하지 않는다.
 * 5분: 일반적인 세션 만료(보통 30분~수 시간)보다는 짧지만, 빠른 페이지 이동마다
 * /me를 호출하지 않기 위한 임계치. TTL 만료 후의 다음 네비게이션에서 재확인한다.
 */
const TTL_MS = 5 * 60 * 1000;

/**
 * /accounts/me 호출 실패에 대한 사용자용 메시지를 반환한다.
 * httpClient의 generic fallback("요청에 실패했습니다.")은 /me 맥락에서 친화적이지
 * 않으므로, 상태 코드별로 알맞은 안내문을 사용한다.
 */
function authErrorMessage(err: unknown): string {
  // 네트워크 단절 등 fetch 자체가 던지는 오류
  if (err instanceof TypeError) {
    return '네트워크 연결을 확인해 주십시오.';
  }

  if (err instanceof ApiError) {
    const { status } = err;

    // 401/403: 세션 만료 또는 접근 권한 없음 - 곧바로 /login으로 이동하므로 사유를 명시
    if (status === 401 || status === 403) {
      return '세션이 만료되었습니다. 다시 로그인해 주십시오.';
    }

    // 5xx: 일시적 서버 오류
    if (status !== undefined && status >= 500) {
      return '잠시 후 다시 시도해 주십시오.';
    }

    // 백엔드가 보내준 의미 있는 메시지가 있으면 그대로 사용 (단, httpClient의 generic fallback은 무시)
    if (err.message && err.message !== '요청에 실패했습니다.') {
      return err.message;
    }
  } else if (err instanceof Error && err.message) {
    return err.message;
  }

  return '로그인이 필요합니다.';
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AccountMeResponse | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const initialCheckDoneRef = useRef(false);
  const initialFetchStartedRef = useRef(false);
  const lastCheckedAtRef = useRef<number>(0);
  const location = useLocation();

  // Internal fetcher: showLoading=false means the previous status (usually 'authenticated')
  // should remain visible while the background request is in flight, so navigating between
  // authenticated pages doesn't flash the "세션 확인 중..." spinner.
  const fetchAccount = useCallback(async (showLoading: boolean, signal?: AbortSignal) => {
    if (showLoading) {
      setStatus('loading');
    }
    setError(null);
    try {
      const account = await getMyAccount({ signal });
      if (signal?.aborted) return;
      setUser(account);
      setStatus('authenticated');
      lastCheckedAtRef.current = Date.now();
    } catch (err: unknown) {
      if (signal?.aborted) return;
      setUser(null);
      setError(authErrorMessage(err));
      setStatus('unauthenticated');
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchAccount(true);
  }, [fetchAccount]);

  const clearAuth = useCallback(() => {
    setUser(null);
    setStatus('unauthenticated');
    setError(null);
  }, []);

  // 1) Initial session check on mount — drives the boot-time spinner in ProtectedRoute.
  // Guarded by `initialFetchStartedRef` and intentionally has NO cleanup abort:
  // React 18+ StrictMode runs mount effects twice in dev. Aborting in cleanup would
  // cancel the first request (visible as `(canceled)` in DevTools) and leave the UI
  // stuck on the loading spinner. AuthProvider wraps the whole app and never unmounts
  // during normal usage, so letting the singleton fetch complete naturally is safe.
  useEffect(() => {
    if (initialFetchStartedRef.current) return;
    initialFetchStartedRef.current = true;
    fetchAccount(true).finally(() => {
      initialCheckDoneRef.current = true;
    });
  }, [fetchAccount]);

  // 2) Lazy validation: register a 401 hook so any API call returning 401 invalidates auth.
  // This avoids polling /me on every navigation while still catching session expiry the
  // moment it shows up via a real API call.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearAuth();
    });
    return () => setUnauthorizedHandler(null);
  }, [clearAuth]);

  // 3) TTL-gated re-verification on navigation. Within TTL_MS of the last successful /me,
  // we trust the cached `authenticated` state and skip the call. After TTL expires, the
  // next navigation triggers a background refetch; if the session is gone, ProtectedRoute
  // redirects to /login.
  useEffect(() => {
    if (!initialCheckDoneRef.current) return;
    if (Date.now() - lastCheckedAtRef.current < TTL_MS) return;
    const controller = new AbortController();
    fetchAccount(false, controller.signal);
    return () => controller.abort();
  }, [location.pathname, fetchAccount]);

  // 4) Tab visibility: when the user returns to the tab (e.g. switched back from another
  // tab where they logged out), force a fresh check. This is the only "always refresh"
  // path besides the initial mount — navigation alone no longer does it.
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return;
      if (!initialCheckDoneRef.current) return;
      fetchAccount(false);
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [fetchAccount]);

  return (
    <AuthContext.Provider value={{ user, status, error, refetch, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};