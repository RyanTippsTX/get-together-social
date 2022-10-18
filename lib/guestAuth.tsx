import { createContext, useContext, useEffect, useState } from 'react';
// import { Session, User } from '@supabase/supabase-js';

interface GuestAuthInterface {
  guest: string | null;
  setGuest: Function;
  // guestList: string[] | undefined | null;
  // key: display_name, value: guest_id
  guestList: Map<string, string> | null;
  setGuestList: Function;
}
export const GuestAuthContext = createContext<GuestAuthInterface | undefined>(undefined);

export function GuestAuthProvider({ ...props }) {
  const [guest, setGuest] = useState<string | null>(null);
  // const [guest, setGuest] = useState<string | null>('Jane Doe');
  const [guestList, setGuestList] = useState<GuestAuthInterface['guestList']>(null);
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
  const context = useContext(GuestAuthContext);
  if (context === undefined) {
    throw new Error('useGuestAuth must be used within a GuestAuthProvider');
  }
  return context;
}
