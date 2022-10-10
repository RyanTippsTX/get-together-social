import { getInitials } from '../lib/initials';
import { EditImageIcon } from '../components/EditImageIcon';
import { useEffect, useState } from 'react';
import Layout from '../components/layout';
import supabase from '../lib/supabase';
import Image from 'next/image';
import { useAuth } from '../lib/auth';
import { useProfile } from '../lib/profile';
import { getEvents } from '../lib/queries';
import { Event, Events } from '../lib/queries.types';
import { EventCard, EventCardCreate } from '../components/EventCard';
import { useRouter } from 'next/router';
import { ModalDisplayNameForm } from '../components/ModalDisplayNameForm';
import { ModalAvatarForm } from '../components/ModalAvatarForm';

export default function Dashboard() {
  const router = useRouter();
  const { session, user, sessionStale, signOut, signInWithEmail, signInWithGoogle } = useAuth();
  const { profile, avatar_url, display_name, profileStale } = useProfile();

  const [avatarModalOpen, setAvatarModalOpen] = useState<boolean>(false);
  const [displayNameModalOpen, setDisplayNameModalOpen] = useState<boolean>(false);
  const [events, setEvents] = useState<Events | undefined>(undefined);

  // fetch events
  useEffect(() => {
    if (user) {
      (async () => {
        const { data, error } = await getEvents(user.id);
        setEvents(data as Events);
      })();
    } else {
      setEvents(undefined);
    }
  }, [user]);

  // route to log-in page if not logged in
  // (this is inside a useEffect hook so that it does not take precence over the routing when signing out)
  useEffect(() => {
    if (!sessionStale && !user) {
      router.push('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionStale]);

  return (
    <Layout>
      {displayNameModalOpen && (
        <ModalDisplayNameForm
          isOpen={displayNameModalOpen}
          closeModal={() => {
            setDisplayNameModalOpen(false);
          }}
        />
      )}
      <ModalAvatarForm
        isOpen={avatarModalOpen}
        closeModal={() => {
          setAvatarModalOpen(false);
        }}
      />
      <div className="px-2 py-4 text-zinc-800">
        <h1 className="pb-2 text-4xl font-bold tracking-tight">Host Dashboard</h1>

        {!sessionStale && user && !profileStale && profile && (
          <div className="flex flex-wrap place-content-between items-center gap-4 ">
            <div className="flex-0 flex items-center gap-4">
              <div
                onClick={() => {
                  setAvatarModalOpen(true);
                }}
                className="hover:cursor-pointer"
              >
                {avatar_url ? (
                  <div className="avatar placeholder block">
                    <div className="w-16 rounded-full">
                      <figure className="relative h-full w-full">
                        <Image
                          src={avatar_url} // avoid abusing GitHub's image hosting
                          alt={'picture of ' + display_name}
                          layout="fill"
                          objectFit="cover"
                          placeholder="blur"
                          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
                        />
                      </figure>
                    </div>
                    <EditImageIcon />
                  </div>
                ) : (
                  <div className="avatar placeholder">
                    <EditImageIcon />
                    <div className="bg-neutral-focus text-neutral-content w-16 rounded-full">
                      <span className="text-2xl font-medium">
                        {getInitials(profile.display_name || profile.email || '?')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <div
                  className="flex items-center gap-2 text-lg font-semibold hover:cursor-pointer"
                  onClick={() => {
                    setDisplayNameModalOpen(true);
                  }}
                >
                  <h2>{profile.display_name}</h2>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                </div>
                <h2 className="">{user.email}</h2>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  router.push('/new');
                }}
                className="btn btn-primary"
              >
                Create New Event
              </button>
              <button onClick={signOut} className="btn btn-primary">
                Sign Out
              </button>
            </div>
          </div>
        )}

        {events && (
          <div className="mb-4 py-4 ">
            <h1 className="pb-4 text-3xl font-bold tracking-tight">Your Events:</h1>
            <div className="flex flex-wrap place-content-center gap-6">
              {events.map((event: Event) => (
                <EventCard key={event.event_id} {...{ event }} />
              ))}
              <EventCardCreate />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
