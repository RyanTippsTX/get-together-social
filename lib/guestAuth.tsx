import { createContext, useContext, useEffect, useState } from 'react';
// import { Session, User } from '@supabase/supabase-js';

type Guest = { display_name: string; guest_id: string };

interface GuestAuthInterface {
  guest: Guest | null; // guest_id
  setGuest: Function;
  guestList: Guest[] | null;
  setGuestList: Function;
}
export const GuestAuthContext = createContext<GuestAuthInterface | undefined>(undefined);

export function GuestAuthProvider({ ...props }) {
  const [guest, setGuest] = useState<GuestAuthInterface['guest']>(null);
  const [guestList, setGuestList] = useState<GuestAuthInterface['guestList']>(null);

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
