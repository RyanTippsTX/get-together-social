import Image from 'next/image';
import { Event } from '../models/models.types';

export function EventCard({ event }: { event: Event }) {
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
    <div className="card card-compact bg-base-100 w-80 flex-none shadow-xl">
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
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{date}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Link</button>
          <button className="btn btn-primary">Edit</button>
          <button className="btn btn-primary">View</button>
          {/* <button className="btn btn-warning">Delete</button> */}
        </div>
      </div>
    </div>
  );
}
