import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout';
import { EventForm } from '../../components/EventForm';
import { AppLoadingIndicator } from '../../components/AppLoading';
import { useAuth } from '../../lib/auth';
import { getEvent, updateEvent } from '../../lib/queries';
import { Event } from '../../lib/queries.types';

export async function getServerSideProps(context: { params: { slug: string[] } }) {
  const { data: event } = await getEvent({ url_code: context.params.slug[0] });
  return event ? { props: { event } } : { notFound: true };
}
export default function Edit({ event }: { event: Event }) {
  const router = useRouter();
  const { user, sessionStale } = useAuth();
  useEffect(() => {
    if (!sessionStale && !user) void router.replace('/login');
  }, [user, sessionStale, router]);
  const eventPath = `/${event.url_code}/${event.url_string}`;
  return (
    <Layout metaTags={{ pageTitle: 'Edit event · GetTogether.social' }}>
      {sessionStale || !user ? (
        <AppLoadingIndicator />
      ) : user.id !== event.host_id ? (
        <p className="card p-8">Only the host can edit this event.</p>
      ) : (
        <>
          <div className="page-heading">
            <p className="eyebrow">A little change of plans</p>
            <h1 className="page-title">Make it yours.</h1>
            <p className="subheading">Update the details. Your guests will see the latest plan.</p>
          </div>
          <EventForm
            key={event.event_id}
            editing
            cancelHref={eventPath}
            defaults={{
              ...event,
              time: event.time || '',
              location: event.location || '',
              contributions_custom_title: event.contributions_custom_title || '',
              contributions_custom_title_enabled: !!event.contributions_custom_title,
            }}
            onSave={async (data) => {
              const { route, error } = await updateEvent({
                ...data,
                event_id: event.event_id,
                url_code: String(event.url_code),
              });
              if (error) throw error;
              await router.push(route);
            }}
          />
        </>
      )}
    </Layout>
  );
}
