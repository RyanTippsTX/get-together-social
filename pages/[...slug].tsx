import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Layout from '../components/layout';
import { Flourish, Icon } from '../components/Icons';
import { ContributionsComponent } from '../components/Contributions';
import { useAuth } from '../lib/auth';
import { useGuestAuth } from '../lib/guestAuth';
import { useEventState } from '../lib/eventState';
import { getEvent, getContributions, getGuestList } from '../lib/queries';
import { Event, Contributions } from '../lib/queries.types';
import { formatDate } from '../lib/dates';
import supabase from '../lib/supabase';

export async function getServerSideProps(context: { params: { slug: string[] } }) {
  const { data: initialEvent } = await getEvent({ url_code: context.params.slug[0] });
  return initialEvent ? { props: { initialEvent } } : { notFound: true };
}

export default function EventPage({ initialEvent }: { initialEvent: Event }) {
  const { user } = useAuth();
  const { event, setEvent } = useEventState();
  const { setGuest, setGuestList } = useGuestAuth();
  const current = event?.event_id === initialEvent.event_id ? event : initialEvent;
  const {
    event_id,
    host_id,
    title,
    date,
    time,
    location,
    description,
    photo_url,
    contributions_enabled,
    contributions_frozen,
    contributions_custom_title,
    hosts: host,
  } = current;
  const [contributions, setContributions] = useState<Contributions | null>(null);
  const [loadError, setLoadError] = useState('');
  const [copied, setCopied] = useState(false);
  const visited = useRef<string | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(copyTimer.current), []);
  useEffect(() => {
    setEvent(initialEvent);
    return () => {
      setEvent(null);
      setGuest(null);
      setGuestList(null);
    };
  }, [initialEvent, setEvent, setGuest, setGuestList]);
  useEffect(() => {
    if (visited.current === event_id) return;
    visited.current = event_id;
    void supabase
      .from('page_visits')
      .insert([{ event_id, user_is_host: user?.id === host_id }])
      .then(() => {});
  }, [event_id, host_id, user?.id]);

  const refreshContributions = useCallback(async () => {
    const [items, guests] = await Promise.all([getContributions(event_id), getGuestList(event_id)]);
    if (items.error || guests.error) {
      setLoadError('We couldn’t load contributions. Please try again.');
      return;
    }
    setLoadError('');
    setContributions(items.data as Contributions);
    setGuestList(guests.data || []);
  }, [event_id, setGuestList]);

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      const { data } = await getEvent({ event_id });
      if (data && active) setEvent(data as Event);
    };
    const channel = supabase
      .channel(`event:${event_id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'events', filter: `event_id=eq.${event_id}` },
        refresh
      )
      .subscribe();
    void refresh();
    return () => {
      active = false;
      void supabase.removeChannel(channel);
    };
  }, [event_id, setEvent]);
  useEffect(() => {
    if (!contributions_enabled) return;
    setContributions(null);
    void refreshContributions();
    const channel = supabase
      .channel(`contributions:${event_id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contributions', filter: `event_id=eq.${event_id}` },
        refreshContributions
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'guests', filter: `event_id=eq.${event_id}` },
        refreshContributions
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [event_id, contributions_enabled, refreshContributions]);

  return (
    <Layout
      eventPage
      metaTags={{
        pageTitle: title,
        pageDescription: description,
        photoUrl: photo_url || undefined,
        pageUrl: `https://gettogether.social/${current.url_code}/${current.url_string}`,
      }}
    >
      <section className="mb-10 grid items-center gap-8 md:grid-cols-2 md:gap-12">
        <div className="order-2 min-w-0 md:order-1">
          <Flourish />
          <h1 className="text-balance font-display break-words text-4xl font-black leading-[1.08] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-4 text-base font-semibold">Hosted by {host.display_name}</p>
          <dl className="my-7 space-y-4 text-sm sm:text-base">
            <div className="flex items-start gap-3">
              <Icon name="calendar" className="mt-0.5 shrink-0" />
              <dt className="sr-only">Date</dt>
              <dd>{formatDate(date)}</dd>
            </div>
            {time && (
              <div className="flex items-start gap-3">
                <Icon name="clock" className="mt-0.5 shrink-0" />
                <dt className="sr-only">Time</dt>
                <dd className="break-words">{time}</dd>
              </div>
            )}
            {location && (
              <div className="flex items-start gap-3">
                <Icon name="pin" className="mt-0.5 shrink-0" />
                <dt className="sr-only">Location</dt>
                <dd className="min-w-0 break-words">{location}</dd>
                <button
                  type="button"
                  className="text-muted hover:text-ink shrink-0 rounded p-1"
                  aria-label={copied ? 'Location copied' : 'Copy location'}
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(location);
                      setCopied(true);
                      clearTimeout(copyTimer.current);
                      copyTimer.current = setTimeout(() => setCopied(false), 2000);
                    } catch {
                      setCopied(false);
                    }
                  }}
                >
                  <Icon name={copied ? 'check' : 'copy'} className="h-4 w-4" />
                </button>
              </div>
            )}
          </dl>
          <div className="text-muted whitespace-pre-wrap break-words text-base leading-7">
            {description.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
              /^https?:\/\//.test(part) ? (
                <a className="link break-all" href={part} key={i} target="_blank" rel="noreferrer">
                  {part}
                </a>
              ) : (
                part
              )
            )}
          </div>
        </div>
        <div className="relative order-1 aspect-[4/3] overflow-hidden rounded-3xl md:order-2">
          <Image
            src={photo_url || '/gathering.jpg'}
            alt={photo_url ? `Cover photo for ${title}` : 'A table ready for good company'}
            fill
            priority
            sizes="(max-width: 767px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </section>
      {contributions_enabled &&
        (loadError ? (
          <div className="card p-6" role="alert">
            {loadError}
            <button className="btn ml-3" onClick={refreshContributions}>
              Try again
            </button>
          </div>
        ) : contributions ? (
          <ContributionsComponent
            contributions={contributions}
            contributions_frozen={contributions_frozen}
            contributions_custom_title={contributions_custom_title}
            host={host}
            onChange={refreshContributions}
          />
        ) : (
          <div className="card text-muted p-8" role="status">
            Loading contributions…
          </div>
        ))}
    </Layout>
  );
}
