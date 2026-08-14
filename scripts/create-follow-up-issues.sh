#!/usr/bin/env bash
# docs/follow-up-issues.md 기반으로 GitHub 이슈를 일괄 생성한다.
# 사용 전: gh auth login 으로 인증 갱신 필요.
# 멱등하지 않음 — 재실행 시 중복 이슈 생성됨.

set -euo pipefail

REPO="haejun-je/jifelog-app"

# 인자 --dry-run 을 주면 명령만 출력하고 실행하지 않는다.
DRY_RUN=0
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=1

if (( ! DRY_RUN )); then
  echo "Target repo: $REPO"
  gh auth status >/dev/null || { echo "ERROR: gh 인증 실패. 'gh auth login' 후 재실행."; exit 1; }
fi

create_issue() {
  local title="$1"
  local body="$2"
  local labels="$3"

  if (( DRY_RUN )); then
    printf '\n>>> gh issue create --repo %s --title %q --label %q --body <<EOF\n%s\nEOF\n' "$REPO" "$title" "$labels" "$body"
  else
    gh issue create --repo "$REPO" --title "$title" --body "$body" --label "$labels"
  fi
}

# ─── 이슈 본문들 ──────────────────────────────────────────────

create_issue \
  "ProtectedRoute: hasAlertedRef로 인한 인증 만료 알림 누락" \
  "$(cat <<'BODY'
**파일:** `components/auth/ProtectedRoute.tsx:14-22`

**문제**
`hasAlertedRef.current`로 첫 unauthenticated 전이에서만 `alert()`을 호출한다. 하이브리드 인증 전략으로 전환 후, 다음 시나리오에서 사용자가 알림을 받지 못한다:

1. 사용자가 보호 페이지에서 활동 중 → TTL 내라 /me 호출 안 됨
2. 다른 API 호출이 401 반환 → httpClient가 unauthorizedHandler 호출 → `clearAuth()` → status='unauthenticated'
3. ProtectedRoute가 status 변화 감지 → 하지만 `hasAlertedRef.current === true`라 alert 생략
4. 사용자는 alert 없이 갑자기 로그인 페이지로 이동, 이유를 모름

**수정 방향**
- 알림 트리거 조건을 `hasAlertedRef` 대신 "이전에 알림을 보낸 에러 메시지와 현재 에러 메시지가 다른가"로 변경
- 또는 401 lazy 경로에서는 silent redirect를 의도적으로 유지하고, alert는 /me 자체 실패에만 표시하도록 분기를 더 명확히 분리

자세한 내용: `docs/follow-up-issues.md` § P1
BODY
)" \
  "bug,priority-high,area:auth"

create_issue \
  "ProtectedRoute: alert()를 react-hot-toast로 교체" \
  "$(cat <<'BODY'
**파일:** `components/auth/ProtectedRoute.tsx:18`

**문제**
앱 전체가 `react-hot-toast` 토스트를 사용한다 (`App.tsx` `<Toaster>` 설정됨). 유일하게 인증 만료 알림만 native `alert()`를 사용 → UX 일관성 깨짐, 모달이 렌더를 차단하면서 AnimatePresence 전환이 부자연스러워질 수 있음.

**수정 방향**
- `import toast from 'react-hot-toast'`
- `alert(error)` → `toast.error(error, { duration: 4000 })`
- P1 (hasAlertedRef) 이슈와 함께 처리

자세한 내용: `docs/follow-up-issues.md` § P1
BODY
)" \
  "chore,ux,area:auth"

create_issue \
  "AuthProvider 단위 테스트 부재" \
  "$(cat <<'BODY'
**파일:** `contexts/AuthContext.tsx`

**문제**
하이브리드 검증 로직은 다음 4가지 트리거를 가진다:
1. 초기 마운트 (StrictMode 가드)
2. 다른 API 401 응답
3. 페이지 이동 (TTL 경과 시)
4. `visibilitychange`

이 분기들의 회귀를 막을 단위 테스트가 없다. 인증 로직은 한 번 깨지면 사용자 전체가 로그아웃되는 큰 사고로 이어진다.

**수정 방향**
- vitest + @testing-library/react 도입
- 다음 케이스 커버:
  - 초기 마운트 시 1회만 fetch (StrictMode 환경에서도)
  - TTL 내 페이지 이동 → fetch 없음
  - TTL 경과 후 페이지 이동 → fetch 1회
  - 탭 가시성 복귀 → fetch
  - 다른 API의 401 → status 즉시 'unauthenticated'
  - /me 401 vs 다른 API 401의 alert 트리거 차이

자세한 내용: `docs/follow-up-issues.md` § P2
BODY
)" \
  "test,area:auth"

create_issue \
  "Safari/iOS bfcache 복귀 시 세션 재확인 누락" \
  "$(cat <<'BODY'
**파일:** `contexts/AuthContext.tsx` (visibilitychange effect)

**문제**
Safari/iOS는 back-forward cache(bfcache)를 적극 사용한다. bfcache에서 복귀할 때 `visibilitychange`가 발생하지 않을 수 있어, 다른 탭에서 로그아웃한 뒤 back navigation으로 돌아온 사용자가 만료된 세션으로 보호 페이지를 계속 보게 된다.

**수정 방향**
- `pageshow` 이벤트 추가 (`persisted === true`인 경우 bfcache 복귀)
- bfcache 복귀 시에는 `fetchAccount(false)` 호출하여 재확인
- `pagehide`는 정리용으로 사용하지 않음 (브라우저 정책상 안전)

자세한 내용: `docs/follow-up-issues.md` § P3
BODY
)" \
  "bug,area:auth"

create_issue \
  "TTL_MS (5분) 매직 넘버 → 환경설수화 또는 백엔드 캐시 힌트 사용" \
  "$(cat <<'BODY'
**파일:** `contexts/AuthContext.tsx:24` (`const TTL_MS = 5 * 60 * 1000`)

**문제**
5분은 임의로 정한 값이다. 백엔드 세션 만료 정책(보통 30분~수 시간)과 쿠키의 `Max-Age`/`Expires`에 따라 최적값이 달라진다. 현재는 정책이 코드에 하드코딩되어 있어 조정 시 코드 변경 + 배포가 필요하다.

**수정 방향**
- 단기: `import.meta.env.VITE_AUTH_TTL_MS`로 추출
- 장기: /me 응답에 `Cache-Control: max-age=...` 또는 `X-Auth-Stale-After` 헤더를 포함하도록 백엔드와 합의 후 그 값을 사용

자세한 내용: `docs/follow-up-issues.md` § P3
BODY
)" \
  "chore,area:auth,tech-debt"

create_issue \
  "httpClient 모듈 전역 unauthorizedHandler 메모리 누수 가능성" \
  "$(cat <<'BODY'
**파일:** `api/httpClient.ts` (`let unauthorizedHandler`), `contexts/AuthContext.tsx` (registration effect)

**문제**
`unauthorizedHandler`는 모듈 레벨 변수로, AuthProvider가 마운트 시 등록하고 unmount 시 `null`로 리셋한다. 정상 unmount에서는 정리되지만:
- Vite HMR로 컴포넌트가 강제 교체될 때 cleanup이 누락될 수 있음
- 비정상 unmount (예: 부모 에러 바운더리 발동) 시 동일 문제

잔존 핸들러는 stale closure를 잡고 있어 다음 AuthProvider 인스턴스의 상태 변경이 잘못된 방향으로 전파될 수 있다.

**수정 방향**
- 단기: AuthProvider 마운트 시점에 명시적으로 `setUnauthorizedHandler(null)` → 등록 (이중 안전)
- 장기: 이벤트 이미터 방식이나 WeakRef 기반으로 변경

자세한 내용: `docs/follow-up-issues.md` § P3
BODY
)" \
  "bug,area:auth,tech-debt"

create_issue \
  "[Pre-existing] App.tsx react-router-dom v7 Routes key 컴파일 에러" \
  "$(cat <<'BODY'
**파일:** `App.tsx:216`

**문제** (이번 PR 이전부터 존재)
```tsx
<Routes location={location} key={location.pathname}>
```
react-router-dom v7에서 `Routes`는 `key` prop을 받지 않는다. `tsc --noEmit`이 이 라인에서 실패한다.

**수정 방향**
- `<AnimatePresence mode="wait">` 안에서 라우트 전환 애니메이션을 원한다면, `Routes`의 `location` prop만 유지하고 `key`는 `<motion.div key={location.pathname}>` 같은 자식 요소로 옮긴다.
- 또는 react-router-dom v6 호환 패턴으로 유지하려면 v6로 다운그레이드

자세한 내용: `docs/follow-up-issues.md` § P4
BODY
)" \
  "bug,typecheck,area:routing"

create_issue \
  "[Pre-existing] config/env.ts의 import.meta.env 타입 선언 누락" \
  "$(cat <<'BODY'
**파일:** `config/env.ts:3, 13`

**문제** (이번 PR 이전부터 존재)
```ts
import.meta.env.VITE_API_HOST
```
`vite/client` 타입 참조가 누락되어 `tsc --noEmit`이 `Property 'env' does not exist on type 'ImportMeta'`로 실패한다.

**수정 방향**
- `src/vite-env.d.ts` 생성: `/// <reference types="vite/client" />`
- 또는 `tsconfig.json`의 `compilerOptions.types`에 `"vite/client"` 추가

자세한 내용: `docs/follow-up-issues.md` § P4
BODY
)" \
  "bug,typecheck,area:build"

echo
echo "완료. 이슈 목록: gh issue list --repo $REPO --label area:auth"