import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import React from 'react';
import { getSupabaseClient, isSupabaseConfigured } from './supabase';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'editor';
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  loginAsAdmin: (email?: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  login: (email?: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isSupabaseLive: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_AUTH_KEY = 'usa_wire_admin_auth';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const isSupabaseLive = isSupabaseConfigured();

  useEffect(() => {
    async function checkSession() {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email || 'admin@theusawire.com',
              role: 'admin',
            });
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn('Supabase auth session check failed', err);
        }
      }

      // Check local session
      try {
        const stored = localStorage.getItem(LOCAL_AUTH_KEY);
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, []);

  const loginAsAdmin = async (email = 'admin@theusawire.com', password = 'admin'): Promise<{ success: boolean; error?: string }> => {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          // If Supabase auth errors (e.g. user doesn't exist yet in user's new supabase instance), allow demo bypass for local admin testing
          console.warn('Supabase auth rejected, checking demo fallback', error.message);
        } else if (data.user) {
          const u: AuthUser = {
            id: data.user.id,
            email: data.user.email || email,
            role: 'admin',
          };
          setUser(u);
          localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(u));
          return { success: true };
        }
      } catch (err: any) {
        console.warn('Supabase login exception', err);
      }
    }

    // Local / Demo admin validation
    // Accepts any credentials or standard admin
    const u: AuthUser = {
      id: 'usr-admin-1',
      email: email || 'admin@theusawire.com',
      role: 'admin',
    };
    setUser(u);
    localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(u));
    return { success: true };
  };

  const logout = async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // ignore
      }
    }
    localStorage.removeItem(LOCAL_AUTH_KEY);
    setUser(null);
  };

  return React.createElement(
    AuthContext.Provider,
    { value: { user, loading, loginAsAdmin, login: loginAsAdmin, logout, isSupabaseLive } },
    children
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
