import { createContext, useEffect, useMemo, useState, useCallback } from 'react';
import { getToken, saveToken, clearToken, clearCnpj } from '@/utils/storage';
import type { UserRole } from '@/interfaces/user';

type Session = {
  token: string | null;
  role?: UserRole;
};

type AuthContextType = {
  session: Session;
  setSession: (s: Session) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<Session>({ token: null });

  useEffect(() => {
    const tk = getToken();
    if (tk) setSessionState((s) => ({ ...s, token: tk }));
  }, []);

  const setSession = useCallback((s: Session) => {
    setSessionState(s);
    if (s.token) saveToken(s.token);
    else clearToken();
  }, []);

  const logout = useCallback(() => {
    setSessionState({ token: null, role: undefined });
    clearToken();
    clearCnpj();
  }, []);

  const api = useMemo<AuthContextType>(() => ({
    session,
    setSession,
    logout,
  }), [session, setSession, logout]);

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}


