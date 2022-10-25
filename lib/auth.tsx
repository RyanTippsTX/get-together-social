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
export const AuthContext = createContext<AuthContextInterface | undefined>(undefined);

export function AuthProvider({ ...props }) {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionStale, setSessionStale] = useState(true);

  useEffect(() => {
    // setSessionLoading(true);
    (async () => {
      // get initial session
      const { data, error } = await supabase.auth.getSession();

      // supabase updates session on future auth state changes
      supabase.auth.onAuthStateChange((event: string, session: Session | null) => {
        setSession(session);
        setSessionStale(false);
        // console.log('supabase updated Auth state');
      });

      // console.log('initial session loaded: ', data.session);
      setSession(data.session);
      setSessionStale(false);

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
      router.push('/my-events');
    } else {
      router.push('/');
    }
  };

  const signInWithGoogle = () => {
    setSessionStale(true);
    (async () => {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        // options: {
        //   redirectTo: 'https://gettogether.social/my-events',
        // },
      });
      setSessionStale(false);
      if (error) {
        console.error(error);
        router.push('/');
      } else {
        // console.log('response:', data);
        router.push('/my-events');
      }
    })();
  };
  const signInWithMagicLink = async ({ email }: { email: string }) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: '/my-events', shouldCreateUser: true },
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
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
