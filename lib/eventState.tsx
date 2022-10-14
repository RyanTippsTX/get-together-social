import { createContext, useContext, useEffect, useState, FormEvent } from 'react';
// import { Session, User } from '@supabase/supabase-js';

interface EventStateInterface {
  eventContext: string | null;
  setEventContext: Function;
}
export const EventStateContext = createContext<EventStateInterface | undefined>(undefined);

export function EventStateProvider({ ...props }) {
  const [eventContext, setEventContext] = useState<string | null>(null);

  return (
    <EventStateContext.Provider
      value={{
        // provides access to shared event state
        eventContext,
        setEventContext,
      }}
      {...props}
    />
  );
}

export function useEventState() {
  const context: any = useContext(EventStateContext);
  if (context === undefined) {
    throw new Error('useEventState must be used within an EventStateProvider');
  }
  return context;
}
