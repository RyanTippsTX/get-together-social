import supabase from '../lib/supabase';
import Layout from '../components/layout';
import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import Image from 'next/image';
import { shimmer, toBase64 } from '../lib/image';
import { ContributionsComponent } from '../components/Contributions';
import { getEvent, getContribution, getContributions } from '../models/models';
import { Host, Event, Guest, Contribution, Contributions } from '../models/models.types';

export async function getServerSideProps(context: { params: { slug: string[] } }) {
  const { slug } = context.params;
  const [url_code, url_string] = slug;

  const { data: event, error } = await getEvent(url_code);

  if (!event) return { notFound: true }; // redirect 404

  return {
    props: { event },
  };
}

export default function EventPage({ event }: { event: Event }) {
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
      if (contributions_enabled) {
        const { data, error } = await getContributions(event_id);

        setContributions(data as Contributions);
      }
    })();
  }, [event_id, contributions_enabled]);

  const image = (
    <figure className="flex flex-col  items-center">
      {/* 400 x 225 is a good */}
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
  );

  const content = (
    <div className="pb-6">
      {/* {<pre>{JSON.stringify(event, null, 2)}</pre>} */}
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
    </div>
  );

  return (
    <Layout>
      <div className="mx-2 overflow-x-clip pb-4">
        {image}
        {content}
        {contributions_enabled && (
          <ContributionsComponent
            contributions_frozen
            {...{ contributions, contributions_custom_title }}
          />
        )}
      </div>
    </Layout>
  );
}
