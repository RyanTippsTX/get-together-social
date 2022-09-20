import { createContext, useContext, useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { Session } from 'inspector';

export const AuthContext = createContext(null);

export function AuthProvider({ supabase, ...props }: any) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('loading: ', loading);
  }, [loading]);
  useEffect(() => {
    (async () => {
      // get initial session
      const { data: activeSession, error } = await supabase.auth.getSession();
      // console.log(activeSession);
      setSession(activeSession);
      setUser(activeSession?.user ?? null);
      setLoading(false);

      // supabase updates session on future auth state changes
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event: string, session: any) => {
          setSession(session);
          setUser(session?.user ?? null);
          console.log('supabase updated Auth state');
        }
      );

      // housekeeping
      return () => {
        authListener?.unsubscribe();
      };
    })();
  }, [supabase.auth]);

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

  const signInWithEmail = async (event: FormEvent, AlertUserThatEmailHasSent: Function) => {
    event.preventDefault();
    const email = (event.target as HTMLFormElement).email.value;
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: '/dashboard', shouldCreateUser: true },
    });
    if (error) {
      console.error('signin result error:', error);
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
        signOut,
        signInWithGoogle,
        signInWithEmail,
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
