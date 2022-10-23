import Image from 'next/image';
import { shimmer, toBase64 } from '../lib/image';
import { Event } from '../lib/queries.types';
import defaultEventImg from '../public/party.jpeg';
import defaultNewEventImg from '../public/party.jpeg';
import { useRouter } from 'next/router';
import { getEventViewCount, softDeleteEvent } from '../lib/queries';
import { useEffect, useState } from 'react';
import { formatDate } from '../lib/dates';
import { ModalEventAvatarForm } from './modals/ModalEventAvatarForm';
import { ModalConfrimDeleteEvent } from './modals/ModalConfirmDeleteEvent';

export function EventCard({ event, setEventsStale }: { event: Event; setEventsStale: Function }) {
  ``;
  const router = useRouter();
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

  const [eventAvatarModalOpen, setEventAvatarModalOpen] = useState<boolean>(false);
  const [confrimDeleteEventModalOpen, setConfrimDeleteEventModalOpen] = useState<boolean>(false);
  const [viewCount, setViewCount] = useState<number | undefined>(undefined);
  useEffect(() => {
    (async () => {
      const { count, error } = await getEventViewCount(event_id);
      setViewCount(count);
    })();
  }, [event_id]);

  return (
    <div
      className="card card-compact bg-base-100 h-96 w-80 flex-none shadow-xl hover:cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        // console.log('clicked event card');
        router.push('/' + url_code + '/' + url_string);
      }}
    >
      <ModalEventAvatarForm
        event={event}
        setEventsStale={setEventsStale}
        isOpen={eventAvatarModalOpen}
        closeModal={() => {
          setEventAvatarModalOpen(false);
        }}
      />
      <ModalConfrimDeleteEvent
        event={event}
        isOpen={confrimDeleteEventModalOpen}
        onSuccess={() => {
          setEventsStale(true);
        }}
        closeModal={() => {
          setConfrimDeleteEventModalOpen(false);
        }}
      />
      {/* Event image */}
      <figure className="relative h-48 w-full">
        {photo_url ? (
          <Image
            src={photo_url || defaultEventImg}
            alt="Event image not found"
            layout="fill"
            objectFit="cover"
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(400, 225))}`}
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-zinc-300 ">
            <svg
              className="h-16 w-16 text-zinc-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.25}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>
        )}
      </figure>
      {/* card body */}
      <div className="card-body tracking-tight">
        <div>
          {/* title */}
          <h2 className="card-title truncate text-ellipsis">{title}</h2>

          {/* date, view count */}
          <div className="flex gap-4 text-zinc-500">
            <div className="flex items-center gap-1  ">
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
              <div className="">{formatDate(date)}</div>
            </div>
            <div className="flex items-center gap-1 ">
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
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>

              <div className="">{viewCount} Views</div>
            </div>
          </div>
        </div>

        {/* description */}
        <p className="line-clamp-2 ">{description}</p>

        {/* buttons */}
        <div
          // className="card-actions justify-end"
          className="grid grid-cols-2 gap-2"
          onClick={(e) => {
            // prevent all child buttons from bubbling up to the card's onClick
            e.stopPropagation();
          }}
        >
          {/* copy link */}
          <button
            onClick={() => {
              // Get URL and copy to clipboard
              const eventUrl = 'https://gettogether.social/' + url_code + '/' + url_string;
              navigator.clipboard.writeText(eventUrl);
              // Alert the copied text
              alert('Copied to clipboard: ' + eventUrl);
            }}
            className="btn btn-sm flex"
          >
            <div className=" pr-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                />
              </svg>
            </div>
            Copy Link
          </button>

          {/* edit content */}
          <button
            onClick={() => {
              router.push('/edit/' + url_code + '/' + url_string);
            }}
            className="btn btn-sm"
          >
            Edit
          </button>

          {/* view */}
          {/* <button
            onClick={() => {
              router.push('/' + url_code + '/' + url_string);
            }}
            className="btn btn-primary"
          >
            View
          </button> */}

          {/* upload image */}
          <button
            onClick={() => {
              // open modal
              setEventAvatarModalOpen(true);
            }}
            className="btn btn-sm"
          >
            Photo
          </button>

          {/* delete */}
          <button
            onClick={() => {
              setConfrimDeleteEventModalOpen(true);
            }}
            className="btn btn-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export function EventCardCreate() {
  const router = useRouter();
  return (
    // <div className="card card-compact bg-base-100 h-96 w-80 flex-none shadow-xl">
    <div className="card card-compact image-full bg-base-100 h-96 w-80 flex-none shadow-xl">
      <figure className="relative h-full w-full">
        <Image
          src={defaultNewEventImg}
          alt="Event image not found"
          layout="fill"
          objectFit="cover"
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(400, 225))}`}
        />
      </figure>

      <div className="card-body items-center justify-center">
        <button
          onClick={() => {
            router.push('/new');
          }}
          className="btn btn-primary gap-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.75}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
          New Event
        </button>
      </div>
    </div>
  );
}
