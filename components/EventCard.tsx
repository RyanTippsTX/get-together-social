import Image from 'next/image';
import { Event } from '../lib/queries.types';
import defaultEventImg from '../public/party.jpeg';
import defaultNewEventImg from '../public/party.jpeg';
import { useRouter } from 'next/router';

export function EventCard({ event }: { event: Event }) {
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

  return (
    <div className="card card-compact bg-base-100 h-96 w-80 flex-none shadow-xl">
      <figure className="relative h-48 w-full">
        <Image
          // src={photo_url || defaultEventImg}
          src={defaultEventImg}
          alt="Shoes"
          layout="fill"
          objectFit="cover"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
        />
        {/* <img src="https://placeimg.com/400/225/arch" alt="Shoes" /> */}
      </figure>
      <div className="card-body tracking-tight">
        <div>
          <h2 className="card-title truncate text-ellipsis">{title}</h2>
          <p className="italic text-zinc-500">{date}</p>
        </div>
        <p className="line-clamp-2 ">{description}</p>
        <div className="card-actions justify-end">
          <button
            onClick={() => {
              // Get URL and copy to clipboard
              const eventUrl = 'https://gettogether.social/' + url_code + '/' + url_string;
              navigator.clipboard.writeText(eventUrl);
              // Alert the copied text
              alert('Copied the text: ' + eventUrl);
            }}
            className="btn btn-primary flex"
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
          <button className="btn btn-primary">Edit</button>
          <button
            onClick={() => {
              router.push('/' + url_code + '/' + url_string);
            }}
            className="btn btn-primary"
          >
            View
          </button>
          {/* <button className="btn btn-warning">Delete</button> */}
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
          alt="Shoes"
          layout="fill"
          objectFit="cover"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
        />
        {/* <img src="https://placeimg.com/400/225/arch" alt="Shoes" /> */}
      </figure>

      <div className="card-body items-center justify-center">
        <button
          onClick={() => {
            router.push('/new');
          }}
          className="btn btn-primary"
        >
          Create New Event
        </button>
      </div>
    </div>
  );
}
