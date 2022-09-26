import Image from 'next/image';
import { Event } from '../models/models.types';
import party from '../public/party.jpeg';
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
          src="https://placeimg.com/400/225/arch"
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
          <button className="btn btn-primary">Link</button>
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
          src={party}
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
