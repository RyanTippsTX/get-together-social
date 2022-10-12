import { createContext, useContext, useEffect, useState, FormEvent } from 'react';
import supabase from './supabase';
import { Database } from './database.types';
import { useAuth } from './auth';
import { useRouter } from 'next/router';

type Profile = Database['public']['Tables']['hosts']['Row'];

interface ProfileContextInterface {
  profile: Profile | null | undefined;
  // undefined - user is authenticated but does not have profile data
  // null - no user
  avatar_url: string | null | undefined;
  display_name: string | null | undefined;
  profileStale: boolean;
  setProfileStale: Function;
}
export const ProfileContext = createContext<ProfileContextInterface | null>(null);

export function ProfileProvider({ ...props }) {
  const router = useRouter();
  const { session, user, sessionStale } = useAuth();
  const [profile, setProfile] = useState<Profile | null | undefined>(null);
  const [profileStale, setProfileStale] = useState<boolean>(false); // "stale" with respect to the provided user/session, regardless if that user/session is marked stale

  // route first-time sign-ups to Welcome page to create their profile
  useEffect(() => {
    if (user && !profile && !profileStale) {
      router.push('/welcome');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // on any change in session/user:
  // if no user, clear profile data
  // if new user, mark profile stale
  useEffect(() => {
    if (!user) {
      setProfile(null);
      setProfileStale(false);
    } else {
      setProfileStale(true);
    }
    // console.log('user is', user);
  }, [user]);

  // if profile stale, fetch profile data (stale implies there IS a user)
  useEffect(() => {
    if (profileStale) {
      (async () => {
        const { data, error } = await supabase
          .from('hosts')
          .select('*')
          .eq('host_id', user.id)
          .single();
        // console.log('fetched profile:', data);
        // if (error) console.log('profile error', error);
        setProfile(data);
        setProfileStale(false);
      })();
    }
  }, [profileStale, user]);

  // console.log('session is:', session);
  // console.log('user is:', user);
  // console.log('profile is:', profile);

  return (
    <ProfileContext.Provider
      value={{
        // provides profile state & profile mutation functions
        profile,
        avatar_url: profile?.avatar_url,
        display_name: profile?.display_name,
        profileStale,
        setProfileStale,
      }}
      {...props}
    />
  );
}

// hook for using app-wide Profile state & Profile mutation functions
export function useProfile() {
  const context: any = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within an ProfileProvider');
  }
  return context;
}
