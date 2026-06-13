type Profile = 'local' | 'dev' | 'prod';

const profile = (import.meta.env.MODE ?? 'local') as Profile;

const hostMap: Record<Profile, string> = {
  local: '',
  dev: 'https://dev-gateway.jifelog.com',
  prod: 'https://gateway.jifelog.com',
};

export const env = {
  profile,
  apiHost: import.meta.env.VITE_API_HOST ?? hostMap[profile],
} as const;
