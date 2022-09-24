import supabase from '../lib/supabase';
import { Database } from '../lib/database.types';
import Layout from '../components/layout';
import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import Image from 'next/image';
import { shimmer, toBase64 } from '../lib/image';

const getEvent = async (url_code: string) => {
  return await supabase
    .from('events')
    .select('*, hosts (*)')
    .eq('url_code', url_code)
    // .eq('url_string', url_string.toLowerCase())  // omit for now
    .single();
};

type Host = Database['public']['Tables']['hosts']['Row'];
type Contributions = Database['public']['Tables']['contributions']['Row'][];
type EventResponse = Awaited<ReturnType<typeof getEvent>>;
type EventResponseSuccess = EventResponse['data'] & {
  hosts: Host;
};

export async function getServerSideProps(context: { params: { slug: string[] } }) {
  const { slug } = context.params;
  const [url_code, url_string] = slug;

  const { data: event, error } = await getEvent(url_code);

  if (!event) return { notFound: true }; // redirect 404

  return {
    props: { event },
  };
}

export default function EventPage({ event }: { event: EventResponseSuccess }) {
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
    hosts,
  } = event;
  const { avatar_url, display_name } = hosts;

  const [contributions, setContributions] = useState<Contributions | undefined>(undefined);
  const [analyticsSent, setAnalyticsSent] = useState<boolean>(false);
  const { session, user, loading, signOut, signInWithEmail, signInWithGoogle } = useAuth();

  // log page visit only once
  useEffect(() => {
    (async () => {
      if (loading) return;
      if (analyticsSent) return;
      const { data, error } = await supabase
        .from('page_visits')
        .insert([{ event_id, user_is_host: user?.id == host_id }]);
      setAnalyticsSent(true);
      console.log('site visit logged for ', user?.email || user?.id || 'guest');
    })();
  }, [loading, user, event_id, host_id, analyticsSent]);

  // fetch contributions if applicable
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
      <div className="mx-2 overflow-x-clip">
        {/* 400 x 225 is a good */}
        <figure className="flex flex-col  items-center">
          <Image
            // layout="responsive"
            width="400"
            height="225"
            src={'https://placeimg.com/400/225/arch'}
            alt={'event photo for ' + title}
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(400, 225))}`}
          />
        </figure>
        <h1 className="text-dark pt-4 pb-2 text-3xl font-bold tracking-tight sm:text-4xl ">
          {title}
        </h1>

        <div className="pb-2 italic">
          <p className=" pb-4">{`Hosted by ${display_name}`}</p>
          <p>{date}</p>
          {time && <p>{time}</p>}
          {location && <p>{location}</p>}
        </div>

        <p>{description}</p>

        {/* <pre>{JSON.stringify(event, null, 2)}</pre> */}

        {contributions_enabled && contributions && <Contributions {...{ contributions }} />}
      </div>
    </Layout>
  );
}

function Contributions({
  contributions,
}: {
  contributions: Database['public']['Tables']['contributions']['Row'][] | undefined;
}) {
  return (
    <div>
      <h2>Contributions:</h2>
      <ContributionsTable />
      <pre>{JSON.stringify(contributions, null, 2)}</pre>
    </div>
  );
}

function ContributionsTable() {
  return (
    <div className="flex flex-col items-center">
      <table className="table w-min ">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Job</th>
            <th>Favorite Color</th>
          </tr>
        </thead>
        <tbody>
          <ContributionsTableRow />
          <ContributionsTableRow />
          <ContributionsTableRow />
        </tbody>
      </table>
    </div>
  );
}

function ContributionsTableRow() {
  return (
    <tr>
      <th>3</th>
      <td>Brice Swyre</td>
      <td>Tax Accountant</td>
      <td>Red</td>
    </tr>
  );
}
