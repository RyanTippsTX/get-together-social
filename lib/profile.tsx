import { createContext, useContext, useEffect, useState, FormEvent } from 'react';
import supabase from './supabase';
import { Session, User } from '@supabase/supabase-js';
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
  const [profileStale, setProfileStale] = useState<boolean>(true);
  // const [profileLoading, setProfileLoading] = useState(false);

  // useEffect(() => {
  //   if (session && sessionLoading) console.error('batch failed');
  // }, [session, sessionLoading]);

  // route first-time sign-ups to Welcome page to create their profile
  useEffect(() => {
    if (user && !profile && !profileStale) {
      router.push('/welcome');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log('user is:', user?.email);
  console.log('didplay name is:', profile?.display_name);

  // on any change in session/user, mark profile stale
  useEffect(() => {
    setProfileStale(true);
  }, [user]);

  // fetch profile data
  useEffect(() => {
    if (user!) {
      setProfile(null);
      setProfileStale(false);
    }

    if (user && profileStale) {
      (async () => {
        const { data, error } = await supabase
          .from('hosts')
          .select('*')
          .eq('host_id', user.id)
          .single();
        console.log('fetched profile:', data);
        setProfile(data);
        setProfileStale(false);
        // if (error) console.log('profile error', error);
      })();
    }
    // setProfileStale(false);
    // setProfileLoading(false);
    // return;
  }, [user, profileStale]);

  return (
    <ProfileContext.Provider
      value={{
        // provides profile state & profile mutation functions
        profile,
        avatar_url: profile?.avatar_url,
        display_name: profile?.display_name,
        profileStale,
        setProfileStale,
        // add profile mutation functions here, e.g:
        // setHostAvatarUrl,
        // setHostDisplayName,
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
