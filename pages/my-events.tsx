import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../components/layout';
import { EventCard, EventCardCreate } from '../components/EventCard';
import { AppLoadingIndicator } from '../components/AppLoading';
import { Icon } from '../components/Icons';
import { getEvents } from '../lib/queries';
import { Events } from '../lib/queries.types';
import { useAuth } from '../lib/auth';
import { useProfile } from '../lib/profile';

export default function MyEvents() {
  const router = useRouter();
  const { user, sessionStale } = useAuth();
  const { profile, profileStale } = useProfile();
  const [events, setEvents] = useState<Events | null>(null);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!sessionStale && !user) void router.replace('/login');
    else if (user && !profileStale && !profile) void router.replace('/welcome');
  }, [user, sessionStale, profile, profileStale, router]);
  useEffect(() => {
    if (!user) return;
    let active = true;
    setError('');
    void getEvents(user.id).then(({ data, error }) => {
      if (!active) return;
      if (error) setError('We couldn’t load your events.');
      else setEvents(data as Events);
    });
    return () => {
      active = false;
    };
  }, [user, retry]);
  return (
    <Layout metaTags={{ pageTitle: 'My events · GetTogether.social' }}>
      <div className="page-heading flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="eyebrow">Good times, all in one place</p>
          <h1 className="page-title">Your get-togethers.</h1>
          <p className="subheading">
            A little planning today. Something to look forward to tomorrow.
          </p>
        </div>
        <Link href="/new" className="btn">
          <Icon name="plus" />
          New event
        </Link>
      </div>
      {error ? (
        <div role="alert" className="card p-6">
          {error}
          <button className="btn ml-3" onClick={() => setRetry((n) => n + 1)}>
            Try again
          </button>
        </div>
      ) : events ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.event_id} event={event} />
          ))}
          <EventCardCreate />
        </div>
      ) : (
        <AppLoadingIndicator />
      )}
    </Layout>
  );
}
