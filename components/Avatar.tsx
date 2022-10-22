import { shimmer, toBase64 } from '../lib/image';
import { getInitials } from '../lib/initials';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { MouseEventHandler } from 'react';
import { useAuth } from '../lib/auth';
import { EditImageIcon } from '../components/EditImageIcon';
import { useEffect, useState } from 'react';
import { useProfile } from '../lib/profile';
import { getEvents } from '../lib/queries';
import { Event, Events } from '../lib/queries.types';
import { EventCard, EventCardCreate } from '../components/EventCard';
import { ModalHostDisplayNameForm } from '../components/modals/ModalHostDisplayNameForm';
import { ModalHostAvatarForm } from '../components/modals/ModalHostAvatarForm';

export function AvatarDropdown({
  profileLoading,
  displayName,
  email,
  avatarUrl,
}: {
  profileLoading: boolean;
  displayName: string | undefined;
  email: string | undefined;
  avatarUrl: string | undefined;
}) {
  const router = useRouter();
  const { session, user, sessionStale, signOut, signInWithMagicLink, signInWithGoogle } = useAuth();
  const { profile, avatar_url, display_name, profileStale } = useProfile();

  const [hostAvatarModalOpen, setHostAvatarModalOpen] = useState<boolean>(false);
  const [displayNameModalOpen, setDisplayNameModalOpen] = useState<boolean>(false);
  const [events, setEvents] = useState<Events | undefined>(undefined);
  const [eventsStale, setEventsStale] = useState(true);

  if (!displayName && !email && !profileLoading) {
    // this means the component was rendered before user data was available ...
    console.error('Avatar is being rendered withoput a display name');
  }

  const avatarButton = (
    <>
      {avatarUrl || profileLoading ? (
        <Avatar {...{ avatarUrl, displayName: displayName as string }} />
      ) : (
        <AvatarPlaceholder {...{ displayName, email }} />
      )}
    </>
  );

  const profileCard = (
    <div
      tabIndex={0}
      className="menu menu-compact dropdown-content rounded-box absolute top-full right-0 mt-3 min-w-max border-[1px] bg-white shadow"
    >
      {!sessionStale && user && !profileStale && profile && (
        <div className="my-6 mx-0 flex flex-col items-center gap-5">
          {/* big avatar display */}
          <div
            onClick={() => {
              setHostAvatarModalOpen(true);
            }}
            className="mx-10 hover:cursor-pointer"
          >
            {avatar_url ? (
              <div className="avatar placeholder block">
                <div className="w-24 rounded-full">
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
                <div className="bg-neutral-focus text-neutral-content w-24 rounded-full">
                  <span className="text-3xl font-medium">
                    {getInitials(profile.display_name || profile.email || '?')}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* display name & email */}
          <div className="mx-10 flex flex-col items-center gap-0">
            {/* display name */}
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

            {/* email */}
            <h2 className="">{user.email}</h2>
          </div>

          <hr className="w-full border-t-[1px]" />

          <button
            onClick={signOut as MouseEventHandler}
            className="btn btn-ghost btn-outline border-zinc-200"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );

  const modalContainers = (
    <>
      <ModalHostDisplayNameForm
        isOpen={displayNameModalOpen}
        closeModal={() => {
          setDisplayNameModalOpen(false);
        }}
      />
      <ModalHostAvatarForm
        isOpen={hostAvatarModalOpen}
        closeModal={() => {
          setHostAvatarModalOpen(false);
        }}
      />
    </>
  );
  return (
    <div className="dropdown dropdown-end flex">
      {modalContainers}
      <div tabIndex={0}>{avatarButton}</div>
      {profileCard}
    </div>
  );
}

export function AvatarPlaceholder({
  displayName,
  email,
}: {
  displayName?: string;
  email?: string;
}) {
  return (
    <div tabIndex={0} className="btn btn-ghost btn-circle avatar placeholder">
      <div className="bg-neutral-focus text-neutral-content w-10 rounded-full">
        <span className="text-xl font-medium">{getInitials(displayName || email || '?')}</span>
      </div>
    </div>
  );
}
export function Avatar({
  avatarUrl,
  displayName,
}: {
  avatarUrl?: string | undefined;
  displayName: string;
}) {
  const blurDataURL = `data:image/svg+xml;base64,${toBase64(shimmer(150, 150))}`;
  return (
    <div tabIndex={0} className="btn btn-ghost btn-circle avatar">
      <div className="w-10 rounded-full">
        <Image
          layout="responsive"
          width="150"
          height="150"
          src={avatarUrl || blurDataURL} // this works but does not blur
          alt={'picture of ' + displayName}
          placeholder="blur"
          blurDataURL={blurDataURL}
        />
      </div>
    </div>
  );
}
