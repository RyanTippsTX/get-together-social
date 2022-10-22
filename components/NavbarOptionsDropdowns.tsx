import Link from 'next/link';
import { MouseEventHandler, useState } from 'react';
import { useAuth } from '../lib/auth';
import { useRouter } from 'next/router';
import { useEventState } from '../lib/eventState';
import { useGuestAuth } from '../lib/guestAuth';
import { ModalGuestDisplayNameForm } from './modals/ModalGuestDisplayNameForm';
import { safeDeleteGuestAndContributions } from '../lib/queries';

export function HostNavbarOptionsDropdown() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { event, setEvent } = useEventState();
  return (
    <div className="dropdown dropdown-end flex">
      <div tabIndex={0} className="btn btn-square btn-ghost flex flex-col">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="inline-block h-5 w-5 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
          ></path>
        </svg>
      </div>

      <ul
        tabIndex={0}
        className="menu menu-compact dropdown-content rounded-box absolute top-full right-0 mt-3 min-w-max border-[1px] bg-white p-2 shadow"
      >
        <li>
          <Link href={'/my-events'}>
            <a className="">My Events</a>
          </Link>
        </li>
        <li>
          <Link href={'/new'}>
            <a className="">New Event</a>
          </Link>
        </li>
        {/* <li>
          <button onClick={signOut as MouseEventHandler} className="">
            Sign Out
          </button>
        </li> */}
        {/* options for event page only */}
        {event && (
          <>
            <li>
              <button
                onClick={() => {
                  // do stuff
                }}
                className=""
              >
                Log In as a Guest
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  if (!event) return;
                  // Get URL and copy to clipboard
                  const eventUrl =
                    'https://gettogether.social/' + event.url_code + '/' + event.url_string;
                  navigator.clipboard.writeText(eventUrl);
                  // Alert the copied text
                  alert('Copied to clipboard: ' + eventUrl);
                }}
                // className="btn btn-primary flex"
              >
                Copy Link
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export function GuestNavbarOptionsDropdown() {
  const router = useRouter();
  const { guest, setGuest, guestList, setGuestList } = useGuestAuth();
  const { signOut } = useAuth();
  const { event, setEvent } = useEventState();
  const [guestDisplayNameModalOpen, setGuestDisplayNameModalOpen] = useState<boolean>(false);

  const { event_id } = event! || {}; // safe to assume event exists if this page is rendering
  const { guest_id } = guest! || {}; // kinda dangerous, but value is only consumed by functions available when there is a guest user

  return (
    <>
      {guestDisplayNameModalOpen && (
        <ModalGuestDisplayNameForm
          isOpen={guestDisplayNameModalOpen}
          closeModal={() => {
            setGuestDisplayNameModalOpen(false);
          }}
        />
      )}
      <div className="dropdown dropdown-end flex">
        <div tabIndex={0} className="btn btn-square btn-ghost flex flex-col">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-5 w-5 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
            ></path>
          </svg>
        </div>

        <ul
          tabIndex={0}
          className="menu menu-compact dropdown-content rounded-box absolute top-full right-0 mt-3 min-w-max border-[1px] bg-white p-2 shadow"
        >
          <li>
            <button
              onClick={() => {
                setGuest(null);
              }}
            >
              Sign Out of Guest Account
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setGuestDisplayNameModalOpen(true);
              }}
            >
              Edit My Display Name
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setGuest(null);
                safeDeleteGuestAndContributions(guest_id);
              }}
            >
              Delete My Account & Contributions
            </button>
          </li>
          {/* Future option: allow account merge in case a user accidentally contributes under multiple names */}
          {/* <li>
          <button>Merge With Another Guest </button> 
        </li> */}
        </ul>
      </div>
    </>
  );
}
