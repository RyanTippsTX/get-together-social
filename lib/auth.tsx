import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Session, User } from '@supabase/supabase-js';
import supabase from './supabase';

interface AuthContextInterface {
  session: Session | null;
  user: User | null;
  sessionStale: boolean;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithMagicLink: (input: { email: string }) => Promise<void>;
}
export const AuthContext = createContext<AuthContextInterface | undefined>(undefined);
export function AuthProvider({ ...props }) {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionStale, setSessionStale] = useState(true);
  const router = useRouter();
  useEffect(() => {
    let active = true;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) {
        setSession(session);
        setSessionStale(false);
      }
    });
    void supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setSession(data.session);
        setSessionStale(false);
      }
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert('Couldn’t sign out. Please try again.');
      return;
    }
    await router.push('/');
  };
  // The origin must also be allowed in Supabase Auth's redirect URL configuration.
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/login` },
    });
    if (error) throw error;
  };
  const signInWithMagicLink = async ({ email }: { email: string }) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/login`, shouldCreateUser: true },
    });
    if (error) throw error;
  };
  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user || null,
        sessionStale,
        signOut,
        signInWithGoogle,
        signInWithMagicLink,
      }}
      {...props}
    />
  );
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
