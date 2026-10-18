import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useEventState } from '../lib/eventState';
import { useGuestAuth } from '../lib/guestAuth';
import { safeDeleteGuestAndContributions } from '../lib/queries';
import { ModalGuestDisplayNameForm } from './modals/ModalGuestDisplayNameForm';
import { ModalEventAvatarForm } from './modals/ModalEventAvatarForm';
import { ModalConfrimDeleteEvent } from './modals/ModalConfirmDeleteEvent';
import { ModalGuestLogin } from './modals/ModalGuestLogin';
import { Dropdown } from './Dropdown';

export function HostNavbarOptionsDropdown() {
  const router = useRouter();
  const { event } = useEventState();
  const [modal, setModal] = useState<'guest' | 'photo' | 'delete' | null>(null);
  if (!event) return null;
  return (
    <>
      <Dropdown label="Event options">
        <Link href={`/edit/${event.url_code}/${event.url_string}`}>Edit event</Link>
        <button onClick={() => setModal('photo')}>Upload a cover photo</button>
        <button
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(
                `${window.location.origin}/${event.url_code}/${event.url_string}`
              );
              alert('Event link copied.');
            } catch {
              alert('Could not copy the link. You can copy it from your address bar.');
            }
          }}
        >
          Copy event link
        </button>
        <button onClick={() => setModal('guest')}>Log in as a guest</button>
        <button className="text-error" onClick={() => setModal('delete')}>
          Delete event
        </button>
      </Dropdown>
      <ModalGuestLogin
        isOpen={modal === 'guest'}
        closeModal={() => setModal(null)}
        onSuccess={() => setModal(null)}
      />
      <ModalEventAvatarForm
        event={event}
        isOpen={modal === 'photo'}
        closeModal={() => setModal(null)}
        onSuccess={() => setModal(null)}
      />
      <ModalConfrimDeleteEvent
        event={event}
        isOpen={modal === 'delete'}
        closeModal={() => setModal(null)}
        onSuccess={() => router.push('/my-events')}
      />
    </>
  );
}
export function GuestNavbarOptionsDropdown() {
  const { guest, setGuest } = useGuestAuth();
  const [nameOpen, setNameOpen] = useState(false);
  return (
    <>
      <Dropdown label="Guest options">
        <button onClick={() => setNameOpen(true)}>Edit my display name</button>
        <button onClick={() => setGuest(null)}>Sign out as guest</button>
        <button
          className="text-error"
          onClick={async () => {
            if (
              !guest ||
              !window.confirm('Delete your guest name and contributions from this event?')
            )
              return;
            await safeDeleteGuestAndContributions(guest.guest_id);
            setGuest(null);
          }}
        >
          Delete my guest contributions
        </button>
      </Dropdown>
      <ModalGuestDisplayNameForm isOpen={nameOpen} closeModal={() => setNameOpen(false)} />
    </>
  );
}
