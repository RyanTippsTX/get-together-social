import { createContext, useContext, useEffect, useState, Dispatch, SetStateAction } from 'react';
import supabase from './supabase';
import { Database } from './database.types';
import { useAuth } from './auth';

type Profile = Database['public']['Tables']['hosts']['Row'];
interface ProfileContextInterface {
  profile: Profile | null | undefined;
  avatar_url: string | null | undefined;
  display_name: string | null | undefined;
  profileStale: boolean;
  loading: boolean;
  error: string;
  retry: () => void;
  setProfileStale: Dispatch<SetStateAction<boolean>>;
}
export const ProfileContext = createContext<ProfileContextInterface | null>(null);
export function ProfileProvider({ ...props }) {
  const { user, sessionStale } = useAuth();
  const [profile, setProfile] = useState<Profile | null | undefined>(null);
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null);
  const [stale, setProfileStale] = useState(false);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const userId = user?.id;
  useEffect(() => {
    if (!userId) {
      setError('');
      setProfile(null);
      setLoadedUserId(null);
      setProfileStale(false);
      return;
    }
    if (!stale && loadedUserId === userId) return;
    let active = true;
    setError('');
    void supabase
      .from('hosts')
      .select('*')
      .eq('host_id', userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        // An unavailable profile is not evidence that this is a new user.
        if (error) {
          setError('We couldn’t load your profile. Please try again.');
          return;
        }
        setProfile(data || undefined);
        setLoadedUserId(userId);
        setProfileStale(false);
      });
    return () => {
      active = false;
    };
  }, [userId, stale, loadedUserId, attempt]);
  const profileStale = sessionStale || (!!userId && (loadedUserId !== userId || stale));
  const currentProfile = userId && loadedUserId === userId ? profile : null;
  return (
    <ProfileContext.Provider
      value={{
        profile: currentProfile,
        avatar_url: currentProfile?.avatar_url,
        display_name: currentProfile?.display_name,
        profileStale,
        loading: profileStale,
        error,
        retry: () => setAttempt((value) => value + 1),
        setProfileStale,
      }}
      {...props}
    />
  );
}
export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('useProfile must be used within a ProfileProvider');
  return context;
}
