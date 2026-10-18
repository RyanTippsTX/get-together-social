import Link from 'next/link';
import { useState } from 'react';
import { Brand } from './Brand';
import { AvatarDropdown } from './Avatar';
import { HostNavbarOptionsDropdown, GuestNavbarOptionsDropdown } from './NavbarOptionsDropdowns';
import { useAuth } from '../lib/auth';
import { useProfile } from '../lib/profile';
import { useEventState } from '../lib/eventState';
import { useGuestAuth } from '../lib/guestAuth';
import { ModalGuestLogin } from './modals/ModalGuestLogin';
import { Icon } from './Icons';

export function Navbar({ eventPage }: { eventPage?: boolean }) {
  const { user, sessionStale } = useAuth();
  const { profile, loading } = useProfile();
  const { event } = useEventState();
  const { guest, guestList } = useGuestAuth();
  const [guestOpen, setGuestOpen] = useState(false);
  const isHost = user && user.id === event?.host_id;
  const isGuest = guest && !isHost;
  return (
    <div className="site-width flex min-h-[84px] flex-wrap items-center justify-between gap-x-3 gap-y-2 py-4">
      <Brand />
      <nav aria-label="Main navigation" className="flex items-center gap-1 sm:gap-3">
        {eventPage ? (
          isHost ? (
            <>
              <Link href="/my-events" className="text-sm font-semibold">
                My events
              </Link>
              <HostNavbarOptionsDropdown />
            </>
          ) : isGuest ? (
            <>
              <span className="max-w-[120px] truncate text-sm font-medium">
                {guestList?.find((g) => g.guest_id === guest.guest_id)?.display_name}
              </span>
              <GuestNavbarOptionsDropdown />
            </>
          ) : (
            <button type="button" className="btn px-3 sm:px-5" onClick={() => setGuestOpen(true)}>
              <Icon name="user" />
              <span>Guest login</span>
            </button>
          )
        ) : user ? (
          <Link href="/my-events" className="text-sm font-semibold">
            My events
          </Link>
        ) : (
          <Link href="/login" className="btn btn-outline px-3 sm:px-5">
            <Icon name="user" />
            <span>Host login</span>
          </Link>
        )}
        {user && (!eventPage || isHost) && (
          <AvatarDropdown
            profileLoading={loading || sessionStale}
            displayName={profile?.display_name || undefined}
            email={user.email}
            avatarUrl={profile?.avatar_url || undefined}
          />
        )}
      </nav>
      <ModalGuestLogin
        isOpen={guestOpen}
        closeModal={() => setGuestOpen(false)}
        onSuccess={() => setGuestOpen(false)}
      />
    </div>
  );
}
