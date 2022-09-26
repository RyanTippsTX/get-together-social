import { useEffect, useState } from 'react';
import Layout from '../components/layout';
import supabase from '../lib/supabase';
import Image from 'next/image';
import { useAuth } from '../lib/auth';
import { useProfile } from '../lib/profile';
import { getEvents } from '../models/models';
import { Event, Events } from '../models/models.types';
import { EventCard } from '../components/EventCard';

export default function Dashboard() {
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

  return (
    <Layout>
      <div className="mx-2 overflow-x-clip pb-4">
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        {/* {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>loading...</p>} */}
        {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
        {/* <pre>{JSON.stringify(displayName, null, 2)}</pre> */}
        {profile && (
          <div>
            <p>user: {profile.display_name}</p>
            <figure className="relative h-44 w-44">
              <Image
                src={profile.avatar_url} // avoid abusing GitHub's image hosting
                alt={'picture of ' + profile.display_name}
                layout="fill"
                objectFit="cover"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
              />
              {/* <img src="https://placeimg.com/400/225/arch" alt="Shoes" /> */}
            </figure>
          </div>
        )}
        {user && (
          <>
            <h1>User: {user.email}</h1>
            <button
              onClick={signOut}
              className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
            >
              Sign Out
            </button>
          </>
        )}
        <h1 className="text-xl font-bold">Your Events: </h1>
        {/* <pre>{JSON.stringify(events, null, 2)}</pre> */}
        {events && (
          <div className="flex flex-wrap gap-6">
            {events.map((event: Event) => (
              // <li key={e.event_id}>{e.title}</li>
              <EventCard key={event.event_id} {...{ event }} />
            ))}
          </div>
        )}

        <button className="btn btn-primary">create new event</button>
      </div>
    </Layout>
  );
}
