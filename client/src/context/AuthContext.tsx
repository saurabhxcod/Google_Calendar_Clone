import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthState } from '../types';
import * as api from '../services/api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  googleLogin: (tokenData: { credential?: string; accessToken?: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem('gcal_token');
    const user = localStorage.getItem('gcal_user');
    if (token && user) {
      setState({ token, user: JSON.parse(user), isLoading: false });
    } else {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.login(email, password);
    localStorage.setItem('gcal_token', data.token);
    localStorage.setItem('gcal_user', JSON.stringify(data.user));
    setState({ user: data.user, token: data.token, isLoading: false });
  };

  const register = async (name: string, email: string, password: string) => {
    const { data } = await api.register(name, email, password);
    localStorage.setItem('gcal_token', data.token);
    localStorage.setItem('gcal_user', JSON.stringify(data.user));
    setState({ user: data.user, token: data.token, isLoading: false });
  };

  const googleLogin = async (tokenData: { credential?: string; accessToken?: string }) => {
    const { data } = await api.googleLogin(tokenData);
    localStorage.setItem('gcal_token', data.token);
    localStorage.setItem('gcal_user', JSON.stringify(data.user));
    setState({ user: data.user, token: data.token, isLoading: false });
  };

  const logout = () => {
    localStorage.removeItem('gcal_token');
    localStorage.removeItem('gcal_user');
    setState({ user: null, token: null, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};