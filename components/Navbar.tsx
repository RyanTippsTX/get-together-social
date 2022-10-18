import { Brand } from './Brand';
import { HostNavbarOptionsDropdown, GuestNavbarOptionsDropdown } from './EventPageOptionsDropdowns';
import { AvatarDropdown, AvatarPlaceholder } from './Avatar';
import { useAuth } from '../lib/auth';
import { useProfile } from '../lib/profile';
import { useEventState } from '../lib/eventState';
import { useGuestAuth } from '../lib/guestAuth';
import Link from 'next/link';
import { useState } from 'react';
import { ModalGuestLogin } from './modals/ModalGuestLogin';

export function Navbar({ eventPage }: { eventPage?: boolean }) {
  const { session, user, sessionStale, signOut, signInWithMagicLink, signInWithGoogle } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { guest, setGuest, guestList, setGuestList } = useGuestAuth();
  const { event, setEvent } = useEventState();

  // modal states - move to context and add renderings there if possible
  const [guestLoginModalOpen, setGuestLoginModalOpen] = useState<boolean>(false);

  const navLeft = (
    <div className="flex-1">
      <Brand />
    </div>
  );

  const isHost = user && user.id === event?.host_id;
  const isGuest = guest && !isHost; // let host account take precedence in event of a shared device
  const isSpectator = !isHost && !isGuest; // note, this could be an authenticated host account for a different event, or a non-authenticated page viewer.

  // if user is NOT host, alert with modal that they may still participate as guest

  const navRight = eventPage ? (
    // nav items for event-page:
    <div className="flex-none">
      {isHost && (
        <>
          <HostNavbarOptionsDropdown />
          <div className="px-1 font-medium tracking-tight">Host:</div>
          <AvatarDropdown
            profileLoading={profileLoading}
            displayName={profile?.display_name}
            email={user.email}
            avatarUrl={profile?.avatar_url}
          />
        </>
      )}
      {isGuest && (
        <>
          <GuestNavbarOptionsDropdown />
          <div className="px-1 font-medium tracking-tight">Guest:</div>
          {/* <AvatarPlaceholder displayName={guest} /> */}
          <div className="px-1 font-normal tracking-tight">
            {guestList?.find((g) => g.guest_id === guest.guest_id)?.display_name}
          </div>
        </>
      )}
      {isSpectator && (
        <>
          <ModalGuestLogin
            isOpen={guestLoginModalOpen}
            closeModal={() => {
              setGuestLoginModalOpen(false);
            }}
            onSuccess={() => {
              // log in the guest
              setGuestLoginModalOpen(false);
            }}
          />
          <div
            onClick={() => {
              setGuestLoginModalOpen(true);
            }}
            className="flex items-center gap-1 hover:cursor-pointer"
          >
            <div className="font-medium">Guest Login</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.75}
              className="inline-block h-6 w-6 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        </>
      )}
    </div>
  ) : (
    // nav items for non-event-pages:
    <div className="flex-none">
      {user && (
        <>
          <AvatarDropdown
            profileLoading={profileLoading}
            displayName={profile?.display_name}
            email={user.email}
            avatarUrl={profile?.avatar_url}
          />
        </>
      )}
      {!user && (
        <Link href={'/login'}>
          <a className="">
            <div className="flex items-center gap-1">
              <div className="font-medium">Host Login</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.75}
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          </a>
        </Link>
      )}
    </div>
  );

  return (
    <div className="border-b-[1px] border-zinc-200 bg-white">
      <div className="container mx-auto ">
        <div className="navbar ">
          {navLeft}
          {navRight}
        </div>
      </div>
    </div>
  );
}
