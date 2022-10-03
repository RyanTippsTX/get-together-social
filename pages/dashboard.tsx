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

export default function Dashboard() {
  const router = useRouter();
  const {
    session,
    user,
    loading: sessionLoading,
    signOut,
    signInWithEmail,
    signInWithGoogle,
  } = useAuth();
  const { profile, loading: profileLoading } = useProfile();

  const [events, setEvents] = useState<Events | undefined>(undefined);

  // fetch events
  useEffect(() => {
    (async () => {
      if (user) {
        const { data, error } = await getEvents(user.id);
        setEvents(data as Events);
      } else {
        setEvents(undefined);
      }
      return;
    })();
  }, [user]);

  // route to log-in page if not logged in
  // (this is inside a useEffect hook so that it does not take precence over the routing when signing out)
  useEffect(() => {
    if (!sessionLoading && !user) {
      router.push('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <div className="px-2 py-4 text-zinc-800">
        <h1 className="pb-2 text-4xl font-bold tracking-tight">Host Dashboard</h1>

        {user && profile && (
          <div className="flex flex-wrap place-content-between items-center gap-4 ">
            <div className="flex-0 flex items-center gap-4">
              <div className="avatar">
                <div className="w-12 rounded-full">
                  <figure className="relative h-full w-full">
                    <Image
                      src={profile.avatar_url} // avoid abusing GitHub's image hosting
                      alt={'picture of ' + profile.display_name}
                      layout="fill"
                      objectFit="cover"
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
                    />
                  </figure>
                </div>
              </div>
              <div>
                <h1 className="text-lg font-semibold">{profile.display_name}</h1>
                <h2 className="">{user.email}</h2>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  router.push('/new');
                }}
                className="btn btn-primary"
              >
                Create New Event
              </button>
              <button onClick={signOut} className="btn btn-primary">
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* {user && profile && (
          // <div className="flex flex-1 flex-col items-center gap-2 pb-4">
          <div className="flex flex-1 flex-col items-center gap-2 pb-4">
            <div className="avatar">
              <div className="w-40 rounded-full">
                <figure className="relative h-full w-full">
                  <Image
                    src={profile.avatar_url} // avoid abusing GitHub's image hosting
                    alt={'picture of ' + profile.display_name}
                    layout="fill"
                    objectFit="cover"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
                  />
                </figure>
              </div>
            </div>

            <div className="flex flex-1 flex-col items-center">
              <h1 className="text-2xl font-bold">{profile.display_name}</h1>
              <h2 className="text-zinc-500">{user.email}</h2>
            </div>

            <div className="card-actions mt-2">
              <button
                onClick={() => {
                  router.push('/new');
                }}
                className="btn btn-primary"
              >
                Create New Event
              </button>
              <button onClick={signOut} className="btn btn-primary">
                Sign Out
              </button>
            </div>
          </div>
        )} */}

        {events && (
          <div className="mb-4 py-4 ">
            <h1 className="pb-4 text-3xl font-bold tracking-tight">Your Events:</h1>
            {/* <div className="flex items-center justify-center">
              <h1 className="pb-4 text-3xl font-bold tracking-tight">Your Events</h1>
            </div> */}
            <div className="flex flex-wrap place-content-center gap-6">
              {events.map((event: Event) => (
                <EventCard key={event.event_id} {...{ event }} />
              ))}
              <EventCardCreate />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
