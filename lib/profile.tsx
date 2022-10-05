import { createContext, useContext, useEffect, useState, FormEvent } from 'react';
import supabase from './supabase';
import { Session, User } from '@supabase/supabase-js';
import { Database } from './database.types';
import { useAuth } from './auth';

type Profile = Database['public']['Tables']['hosts']['Row'];

interface ProfileContextInterface {
  profile: Profile | null | undefined;
  // undefined - user is authenticated but does not have profile data
  // null - no user
  loading: boolean;
}
export const ProfileContext = createContext<ProfileContextInterface | null>(null);

export function ProfileProvider({ ...props }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null | undefined>(null);
  const [loading, setLoading] = useState(true);

  // fetch profile data
  useEffect(() => {
    (async () => {
      if (user) {
        const { data, error } = await supabase
          .from('hosts')
          .select('*')
          .eq('host_id', user.id)
          .single();
        setProfile(data);
        console.log('profile:', error);
        setLoading(false);
      } else {
        setProfile(null);
      }
      return;
    })();
  }, [user]);

  return (
    <ProfileContext.Provider
      value={{
        // provides profile state & profile mutation functions
        profile,
        loading,
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
