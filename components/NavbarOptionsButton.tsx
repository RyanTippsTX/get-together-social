import Link from 'next/link';
import { MouseEventHandler } from 'react';
import { useAuth } from '../lib/auth';

export function NavbarOptionsButton() {
  const { signOut } = useAuth();
  return (
    <div className="dropdown dropdown-end flex">
      <div tabIndex={0} className="btn btn-square btn-ghost">
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
        className="menu menu-compact dropdown-content rounded-box absolute top-full right-0 mt-3 w-auto bg-white p-2 shadow"
      >
        <li>
          <Link href={'/dashboard'}>
            <a className="">Dashboard</a>
          </Link>
        </li>
        <li>
          <Link href={'/new'}>
            <a className="">New Event</a>
          </Link>
        </li>
        <li>
          <button onClick={signOut as MouseEventHandler} className="">
            Sign Out
          </button>
        </li>
      </ul>
    </div>
  );
}

// ['/login', 'Host Login'],
// ['/dashboard', 'Dashboard'],
// ['/new', 'New Event'], // omit in productin
