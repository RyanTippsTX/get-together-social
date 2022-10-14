import { createContext, useContext, useEffect, useState, FormEvent } from 'react';
// import { Session, User } from '@supabase/supabase-js';

interface EventStateInterface {
  event: string | null;
  setEvent: Function;
}
export const EventStateContext = createContext<EventStateInterface | undefined>(undefined);

export function EventStateProvider({ ...props }) {
  const [event, setEvent] = useState<string | null>(null);

  return (
    <EventStateContext.Provider
      value={{
        // provides access to shared event state
        event,
        setEvent,
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
