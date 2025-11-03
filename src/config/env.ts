const isDev = typeof window !== 'undefined' && /localhost|127\.0\.0\.1/.test(window.location.host);

export const ENV = {
  AUTH_API_BASE_URL: isDev ? '/auth-api' : 'https://auvet-autenticacao.onrender.com/api',
  BACKEND_API_BASE_URL: isDev ? '/backend-api' : 'https://auvet-backend.onrender.com/api',
};


