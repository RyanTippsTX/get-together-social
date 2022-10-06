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
  loading: boolean;
  setProfileStale: Function;
}
export const ProfileContext = createContext<ProfileContextInterface | null>(null);

export function ProfileProvider({ ...props }) {
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null | undefined>(null);
  const [profileStale, setProfileStale] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);

  // route first-time sign-ups to Welcome page to create their profile
  useEffect(() => {
    if (user && !loading && !profile) {
      router.push('/welcome');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  // fetch profile data
  useEffect(() => {
    (async () => {
      if (user && profileStale) {
        const { data, error } = await supabase
          .from('hosts')
          .select('*')
          .eq('host_id', user.id)
          .single();
        setProfile(data);
        // console.log('profile:', error);
        setLoading(false);
      } else {
        setProfile(null);
      }
      return;
    })();
  }, [user, profileStale]);

  return (
    <ProfileContext.Provider
      value={{
        // provides profile state & profile mutation functions
        profile,
        loading,
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
