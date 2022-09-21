import { useEffect, useState } from 'react';
import Layout from '../components/layout';
import supabase from '../lib/supabase';
import { Database } from '../lib/database.types';
import Image from 'next/image';
import { useAuth } from '../lib/auth';
import { useProfile } from '../lib/profile';

type Event = Database['public']['Tables']['events']['Row'];

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

  const [events, setEvents] = useState<any>(null);

  // fetch events
  useEffect(() => {
    (async () => {
      if (user) {
        const { data, error } = await supabase.from('events').select('*').eq('host_id', user.id);
        setEvents(data);
      } else {
        setEvents(null);
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
        <ul>
          {events.map((e: Event) => (
            <li key={e.event_id}>{e.title}</li>
          ))}
        </ul>
      )}
      <button className="btn btn-primary">create new event</button>
    </Layout>
  );
}
