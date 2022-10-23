import { getInitials } from '../lib/initials';
import { EditImageIcon } from '../components/EditImageIcon';
import { useEffect, useState } from 'react';
import Layout from '../components/layout';
import supabase from '../lib/supabase';
import Image from 'next/image';
import { useAuth } from '../lib/auth';
import { useProfile } from '../lib/profile';
import { getEvents } from '../lib/queries';
import { Event, Events } from '../lib/queries.types';
import { EventCard, EventCardCreate } from '../components/EventCard';
import { useRouter } from 'next/router';
import { ModalHostDisplayNameForm } from '../components/modals/ModalHostDisplayNameForm';
import { ModalHostAvatarForm } from '../components/modals/ModalHostAvatarForm';
import { MouseEventHandler } from 'react';
import { useAppLoading } from '../lib/appLoading';

export default function MyEvents() {
  const router = useRouter();
  const { appLoading, setAppLoading } = useAppLoading();
  const { session, user, sessionStale, signOut, signInWithMagicLink, signInWithGoogle } = useAuth();
  const { profile, avatar_url, display_name, profileStale } = useProfile();

  const [events, setEvents] = useState<Events | undefined>(undefined);
  const [eventsStale, setEventsStale] = useState(true);

  // fetch events initially
  useEffect(() => {
    if (user) {
      (async () => {
        const { data, error } = await getEvents(user.id);
        setEvents(data as Events);
        setEventsStale(false);
      })();
    } else {
      setEvents(undefined);
      setEventsStale(false);
    }
  }, [user]);

  // fetch events when stale
  useEffect(() => {
    if (eventsStale && user) {
      (async () => {
        const { data, error } = await getEvents(user.id);
        setEvents(data as Events);
        setEventsStale(false);
        setAppLoading(false);
      })();
    } else {
      setEventsStale(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventsStale]);

  // route to log-in page if not logged in
  // (this is inside a useEffect hook so that it does not take precence over the routing when signing out)
  useEffect(() => {
    if (!sessionStale && !user) {
      router.push('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionStale]);

  return (
    <Layout>
      <div className="px-2 pb-4 pt-10 text-zinc-700">
        {/* <h1 className="pb-2 text-4xl font-bold tracking-tight">My Events</h1> */}
        <h1 className=" text-center text-5xl font-bold tracking-tight">{`My Events`}</h1>

        {events && (
          <div className="mb-4 py-6 ">
            {/* <h1 className="pb-4 text-3xl font-bold tracking-tight">Your Events:</h1> */}
            <div className="flex flex-wrap place-content-center gap-6">
              {events.map((event: Event) => (
                <EventCard key={event.event_id} {...{ event }} setEventsStale={setEventsStale} />
              ))}
              <EventCardCreate />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
