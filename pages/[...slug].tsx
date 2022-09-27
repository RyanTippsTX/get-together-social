import supabase from '../lib/supabase';
import Layout from '../components/layout';
import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import Image from 'next/image';
import { shimmer, toBase64 } from '../lib/image';
import { ContributionsComponent } from '../components/Contributions';
import { getEvent, getContribution, getContributions } from '../lib/queries';
import { Host, Event, Guest, Contribution, Contributions } from '../lib/queries.types';
import { formatDate } from '../lib/dates';

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
    hosts: host,
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
      <div className="pb-4  font-light text-zinc-500">
        <div className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            className="inline-block h-4 w-4 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
          {`Hosted by ${display_name}`}
        </div>
        <div className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            className="inline-block h-4 w-4 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
            />
          </svg>
          {formatDate(date)}
        </div>
        {time && (
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              className="inline-block h-4 w-4 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {time}
          </div>
        )}
        {location && (
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              className="inline-block h-4 w-4 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
            {location}
            <div className="btn btn-ghost btn-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                className="inline-block h-4 w-4 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
      <div className="whitespace-pre-line text-lg">{description}</div>
    </div>
  );

  return (
    <Layout>
      <div className="mx-2 pb-4">
        {image}
        {content}
        {contributions_enabled && (
          <ContributionsComponent
            {...{ contributions, contributions_custom_title, contributions_frozen, host }}
          />
        )}
      </div>
    </Layout>
  );
}
