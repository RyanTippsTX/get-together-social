import { createContext, useContext, useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import supabase from './supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextInterface {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: Function;
  signInWithGoogle: Function;
  signInWithMagicLink: Function;
}
export const AuthContext = createContext<AuthContextInterface | null>(null);

export function AuthProvider({ ...props }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   console.log('loading: ', loading);
  // }, [loading]);

  useEffect(() => {
    (async () => {
      // get initial session
      const { data, error } = await supabase.auth.getSession();
      // console.log('initial session loaded: ', data.session);
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);

      // supabase updates session on future auth state changes
      supabase.auth.onAuthStateChange((event: string, session: any) => {
        setSession(session);
        setUser(session?.user ?? null);
        // console.log('supabase updated Auth state');
      });

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
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);
    if (error) {
      console.error(error);
      router.push('/dashboard');
    } else {
      router.push('/');
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    setLoading(false);
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

  return (
    <AuthContext.Provider
      value={{
        // provides auth state & auth mutation functions
        session,
        user,
        loading,
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
  const context: any = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
