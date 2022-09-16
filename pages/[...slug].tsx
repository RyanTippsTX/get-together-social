import supabase from '../lib/supabase';
import { Database } from '../lib/database.types';
import { GetServerSideProps } from 'next';
import Router, { useRouter } from 'next/router';
import Layout from '../components/layout';
import { useState, useEffect } from 'react';

export async function getServerSideProps(context: { params: { slug: string[] } }) {
  // console.log(context);
  const { slug } = context.params;
  const [eventID, eventDescription] = slug;
  // console.log(eventID);
  // console.log(eventDescription);
  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('event_id', eventID)
    .single();

  if (!event) return { notFound: true }; // redirect 404

  return {
    props: { event },
  };
}

export default function EventPage({
  event,
}: {
  event: Database['public']['Tables']['events']['Row'];
}) {
  const [contributions, setContributions] = useState<
    Database['public']['Tables']['contributions']['Row'][] | undefined
  >(undefined);
  // const router = useRouter();
  // const { slug }: { slug?: string[] } = router.query;
  // if (!slug) return; // shouldn't ever happen because of file based routing
  // const [eventID, eventDescription] = slug;

  useEffect(() => {
    (async () => {
      if (event.contributions_enabled) {
        const { data, error } = await supabase
          .from('contributions')
          .select('*, guests( display_name )')
          .eq('event_id', event.event_id)
          .order('created_at', { ascending: false });
        setContributions(data);
      }
    })();
  }, [event]);

  return (
    <Layout>
      {/* <h1 className="text-3xl font-bold">URL EData:/h1>
      <p>Event ID: {eventID}</p>
      <p>Event Description: {eventDescription || 'not encoded'}</p> */}
      <pre>{JSON.stringify(event, null, 2)}</pre>
      <pre>{JSON.stringify(contributions, null, 2)}</pre>
    </Layout>
  );
}
