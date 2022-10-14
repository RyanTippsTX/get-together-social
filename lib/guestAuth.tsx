import { createContext, useContext, useEffect, useState, FormEvent } from 'react';
// import { Session, User } from '@supabase/supabase-js';

interface GuestAuthInterface {
  guest: string | null;
  setGuest: Function;
  guestList: Set<string> | null;
  setGuestList: Function;
}
export const GuestAuthContext = createContext<GuestAuthInterface | undefined>(undefined);

export function GuestAuthProvider({ ...props }) {
  const [guest, setGuest] = useState<string | null>(null);
  const [guestList, setGuestList] = useState<Set<string> | null>(null);
  // setState(prev => new Set(prev.add(foo)))

  // save/load guest from local storage
  useEffect(() => {
    // ... store guest_id
  }, [guest]);

  return (
    <GuestAuthContext.Provider
      value={{
        // provides access to guest and guest list state
        guest,
        setGuest,
        guestList,
        setGuestList,
      }}
      {...props}
    />
  );
}

export function useGuestAuth() {
  const context: any = useContext(GuestAuthContext);
  if (context === undefined) {
    throw new Error('useGuestAuth must be used within a GuestAuthProvider');
  }
  return context;
}
