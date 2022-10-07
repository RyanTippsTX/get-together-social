import { createContext, useContext, useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import supabase from './supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextInterface {
  session: Session | null;
  user: User | null;
  sessionStale: boolean;
  signOut: Function;
  signInWithGoogle: Function;
  signInWithMagicLink: Function;
}
export const AuthContext = createContext<AuthContextInterface | null>(null);

export function AuthProvider({ ...props }) {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionStale, setSessionStale] = useState(true);
  // const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    // setSessionLoading(true);
    (async () => {
      // get initial session
      console.log('⚙️ loading initial session');
      const { data, error } = await supabase.auth.getSession();

      // supabase updates session on future auth state changes
      supabase.auth.onAuthStateChange((event: string, session: Session | null) => {
        setSession(session);
        setSessionStale(false);
        // setUser(session?.user ?? null);
        // console.log('supabase updated Auth state');
      });

      // console.log('initial session loaded: ', data.session);
      setSession(data.session);
      setSessionStale(false);
      console.log('⚙️ initial session done loading');

      // housekeeping
      // return () => {
      //   // no action needed, Supabase uses channels instead of subscriptions
      //   // no longer need to unsubscribe from Auth Listener
      // };
    })();
  }, []);

  const router = useRouter();

  // Functions for Auth mutation & page redirect
  const signOut = async () => {
    // setSessionLoading(true);
    const { error } = await supabase.auth.signOut();
    // setSessionLoading(false);
    if (error) {
      console.error(error);
      router.push('/dashboard');
    } else {
      router.push('/');
    }
  };

  const signInWithGoogle = async () => {
    setSessionStale(true);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    setSessionStale(false);
    if (error) {
      console.error(error);
      router.push('/');
    } else {
      // console.log(data);
      router.push('/dashboard');
    }
  };

  const signInWithMagicLink = async ({ email }: { email: string }) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: '/dashboard', shouldCreateUser: true },
    });
    if (error) {
      console.error('signin result error:', error);
      alert('An error occured, please try again');
      router.push('/');
    } else {
      // No redirect, stay on login page
      // Toast or Modal: "Email sent to ___@gmail.com !"
      alert(`Email has been sent to ${email}`);
    }
  };

  console.log('session is:', session);

  return (
    <AuthContext.Provider
      value={{
        // provides auth state & auth mutation functions
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

// hook for using app-wide Auth state & Auth mutation functions
export function useAuth() {
  111;
  const context: any = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
