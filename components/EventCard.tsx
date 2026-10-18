import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Event } from '../lib/queries.types';
import { getEventViewCount } from '../lib/queries';
import { formatDate } from '../lib/dates';
import { Icon, Sun } from './Icons';

export function EventCard({ event }: { event: Event }) {
  const [views, setViews] = useState<number | null>(null);
  const [copyState, setCopyState] = useState('Copy link');
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const href = `/${event.url_code}/${event.url_string}`;
  useEffect(() => {
    let active = true;
    void getEventViewCount(event.event_id).then(({ count }) => {
      if (active) setViews(count);
    });
    return () => {
      active = false;
      clearTimeout(timer.current);
    };
  }, [event.event_id]);
  return (
    <article className="border-ink/20 bg-cream hover:shadow-custom flex min-w-0 flex-col overflow-hidden rounded-2xl border transition-shadow">
      <Link href={href} className="group block">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={event.photo_url || '/gathering.jpg'}
            alt=""
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transform-none"
          />
        </div>
        <div className="p-5 pb-3">
          <p className="text-muted mb-2 flex items-center gap-2 text-xs font-medium">
            <Icon name="calendar" className="h-4 w-4" />
            {formatDate(event.date)}
          </p>
          <h2 className="decoration-ink/20 break-words text-2xl underline-offset-4 group-hover:underline">
            {event.title}
          </h2>
          <p className="line-clamp-2 text-muted mt-2 text-sm leading-6">{event.description}</p>
        </div>
      </Link>
      <div className="border-ink/10 mx-5 mt-auto flex items-center justify-between gap-2 border-t py-4">
        <span className="text-muted text-xs">{views === null ? '—' : views} page views</span>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(window.location.origin + href);
              setCopyState('Copied!');
            } catch {
              setCopyState('Copy failed');
            }
            clearTimeout(timer.current);
            timer.current = setTimeout(() => setCopyState('Copy link'), 2200);
          }}
        >
          <Icon name="copy" className="h-4 w-4" />
          <span aria-live="polite">{copyState}</span>
        </button>
      </div>
    </article>
  );
}
export function EventCardCreate() {
  return (
    <Link
      href="/new"
      className="border-ink/30 bg-lemonade/40 hover:bg-lemonade flex min-h-[340px] flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center transition-colors"
    >
      <Sun className="mb-5 h-14 w-14 text-[#c99c00]" />
      <h2 className="text-2xl">There’s always a reason.</h2>
      <p className="text-muted mt-3 max-w-[220px] text-sm leading-6">
        Make room for the next good time with your favorite people.
      </p>
      <span className="btn mt-6">
        <Icon name="plus" />
        New event
      </span>
    </Link>
  );
}
