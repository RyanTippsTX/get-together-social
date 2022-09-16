import { useEffect, useState } from 'react';
import Layout from '../components/layout';
import supabase from '../lib/supabase';
import { Database } from '../lib/database.types';
import Image from 'next/image';

type Event = Database['public']['Tables']['events']['Row'];

export default function Dashboard() {
  // const { data: hosts, error } = await supabase.from('hosts').select('*');
  // const { data: events } = await supabase.from('events').select('*');
  // const { data: guests } = await supabase.from('guests').select('*');
  // const { data: contributions } = await supabase.from('contributions').select('*');

  const [data, setData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [events, setEvents] = useState<any>(null);
  // const [events, setEvents] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from('hosts').select('*');
      setData(data);
      return;
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      return;
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (user) {
        const { data, error } = await supabase
          .from('hosts')
          .select('*')
          .eq('host_id', user.id)
          .single();
        setProfile(data);
      }
      return;
    })();
  }, [user]);

  useEffect(() => {
    (async () => {
      if (user) {
        const { data, error } = await supabase.from('events').select('*').eq('host_id', user.id);
        setEvents(data);
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
