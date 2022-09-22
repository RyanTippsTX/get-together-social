import supabase from '../lib/supabase';
import { Database } from '../lib/database.types';
import Layout from '../components/layout';
import { useState, useEffect } from 'react';

export async function getServerSideProps(context: { params: { slug: string[] } }) {
  const { slug } = context.params;
  const [url_code, url_string] = slug;

  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('url_code', url_code)
    // .eq('url_string', url_string.toLowerCase())  // omit for now
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

  // console.log(event);
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
  } = event;

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
          <img src="https://placeimg.com/400/225/arch" alt="Shoes" />
        </figure>
        <h1 className="text-dark pt-4 text-3xl font-bold tracking-tight sm:text-4xl ">{title}</h1>

        <pre>{JSON.stringify(event, null, 2)}</pre>
        {contributions && <Contributions {...{ contributions }} />}
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
