import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/layout';
import { EventForm } from '../components/EventForm';
import { AppLoadingIndicator } from '../components/AppLoading';
import { useAuth } from '../lib/auth';
import { useProfile } from '../lib/profile';
import { createEvent } from '../lib/queries';

export default function New() {
  const router = useRouter();
  const { user, sessionStale } = useAuth();
  const { profile, profileStale } = useProfile();
  useEffect(() => {
    if (!sessionStale && !user) void router.replace('/login');
    else if (user && !profileStale && !profile) void router.replace('/welcome');
  }, [user, sessionStale, profile, profileStale, router]);
  return (
    <Layout metaTags={{ pageTitle: 'Create an event · GetTogether.social' }}>
      {user && profile ? (
        <>
          <div className="page-heading">
            <p className="eyebrow">Something to look forward to</p>
            <h1 className="page-title">Let’s get together.</h1>
            <p className="subheading">
              Big occasion or no occasion. Make a little space for your people.
            </p>
          </div>
          <EventForm
            onSave={async (data) => {
              const { route, error } = await createEvent({ ...data, host_id: user.id });
              if (error) throw error;
              await router.push(route);
            }}
          />
        </>
      ) : (
        <AppLoadingIndicator />
      )}
    </Layout>
  );
}
