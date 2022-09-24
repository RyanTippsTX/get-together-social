import { useEffect, useState } from 'react';
import Layout from '../components/layout';
import supabase from '../lib/supabase';
import Image from 'next/image';
import { useAuth } from '../lib/auth';
import { useProfile } from '../lib/profile';
import { getEvents } from '../models/models';
import { Event, Events } from '../models/models.types';

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
      <h1 className="text-3xl font-bold">User Dashboard</h1>
      {/* {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>loading...</p>} */}
      {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(displayName, null, 2)}</pre> */}
      {profile && (
        <>
          <p>user: {profile.display_name}</p>
          <Image
            layout="fixed"
            width="150"
            height="150"
            // placeholder="blur"
            // blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
            src={profile.avatar_url} // avoid abusing GitHub's image hosting
            alt={'picture of ' + profile.display_name}
          />
          <br />
        </>
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
    </Layout>
  );
}

function EventCard({ event }: { event: Event }) {
  const {
    event_id,
    created_at,
    host_id,
    title,
    date,
    time,
    location,
    photo_url,
    description,
    contributions_enabled,
    contributions_frozen,
    contributions_custom_title,
    url_code,
    url_string,
    hosts: { avatar_url, display_name },
  } = event;

  return (
    <div className="card bg-base-100 w-96 flex-none shadow-xl">
      <figure>
        <img src="https://placeimg.com/400/225/arch" alt="Shoes" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{date}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Link</button>
          <button className="btn btn-primary">Edit</button>
          <button className="btn btn-primary">View</button>
          <button className="btn btn-warning">Delete</button>
        </div>
      </div>
    </div>
  );
}
