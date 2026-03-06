import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type UserSession = {
  role: 'user';
  fullName: string;
  cnic: string;
  accountNumber: string;
};

export type AdminSession = {
  role: 'admin';
  username: string;
};

type Session = UserSession | AdminSession | null;

type AuthContextValue = {
  session: Session;
  loginUser: (payload: UserSession) => void;
  loginAdmin: (payload: AdminSession) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'banking-ui-session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      setSession(JSON.parse(raw) as Session);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      loginUser: (payload) => {
        setSession(payload);
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      },
      loginAdmin: (payload) => {
        setSession(payload);
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      },
      logout: () => {
        setSession(null);
        sessionStorage.removeItem(STORAGE_KEY);
      },
    }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
