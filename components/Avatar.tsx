import { shimmer, toBase64 } from '../lib/image';
import { getInitials } from '../lib/initials';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { MouseEventHandler } from 'react';
import { useAuth } from '../lib/auth';

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
  const { signOut } = useAuth();
  if (!displayName && !email && !profileLoading) {
    // this means the component was rendered before user data was available ...
    console.error('Avatar is being rendered withoput a display name');
  }

  return (
    <div
      className="dropdown dropdown-end flex"
      // onClick={() => {
      //   router.push('/my-events');
      // }}
    >
      {/* avatar */}
      {avatarUrl || profileLoading ? (
        <Avatar {...{ avatarUrl, displayName: displayName as string }} />
      ) : (
        <AvatarPlaceholder {...{ displayName, email }} />
      )}
      <ul
        tabIndex={0}
        className="menu menu-compact dropdown-content rounded-box absolute top-full right-0 mt-3 min-w-max bg-white p-2 shadow"
      >
        <li>
          <button onClick={signOut as MouseEventHandler} className="">
            Sign Out
          </button>
        </li>
      </ul>
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

export function GuestAvatarDropdown({ displayName }: { displayName: string }) {
  return (
    <div
      className="dropdown dropdown-end flex"
      // onClick={() => {
      //   router.push('/my-events');
      // }}
    >
      {/* avatar */}

      <AvatarPlaceholder {...{ displayName }} />

      <ul
        tabIndex={0}
        className="menu menu-compact dropdown-content rounded-box absolute top-full right-0 mt-3 min-w-max bg-white p-2 shadow"
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
        <li>
          <button
            // onClick={signOut as MouseEventHandler}
            className=""
          >
            Sign Out
          </button>
        </li>
        {/* <li>
            <a className="justify-between">
              Profile
              <span className="badge">New</span>
            </a>
          </li> */}
      </ul>
    </div>
  );
}
