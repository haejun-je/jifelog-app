type Profile = 'development' | 'production';

const profile = import.meta.env.MODE as Profile;

const hostMap: Record<Profile, string> = {
  development: 'http://dev-gateway.jifelog.com',
  production: 'https://gateway.jifelog.com',
};

export const env = {
  profile,
  apiHost: import.meta.env.VITE_API_HOST ?? hostMap[profile],
} as const;
