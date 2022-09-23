import Image from 'next/image';
import { shimmer, toBase64 } from '../lib/image';
import { getInitials } from '../lib/initials';

export function Avatar({
  profileLoading,
  displayName,
  avatarUrl,
}: {
  profileLoading: boolean;
  displayName: string | undefined;
  avatarUrl: string | undefined;
}) {
  if (!displayName && !profileLoading) {
    // this means the component was rendered before user data was available ...
    console.error('Avatar is being rendered withoput a display name');
  }

  const blurDataURL = `data:image/svg+xml;base64,${toBase64(shimmer(150, 150))}`;
  // normal Avatar
  if (avatarUrl || profileLoading) {
    return (
      <div className="dropdown dropdown-end flex">
        <label tabIndex={0} className="btn btn-ghost btn-circle avatar inline-flex">
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
        </label>
        <ul
          tabIndex={0}
          className="menu menu-compact dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow"
        >
          <li>
            <a className="justify-between">
              Profile
              <span className="badge">New</span>
            </a>
          </li>
          <li>
            <a>Settings</a>
          </li>
          <li>
            <a>Logout</a>
          </li>
        </ul>
      </div>
    );
  }

  // Avatar placeholder
  return (
    <div className="avatar placeholder">
      <div className="bg-neutral-focus text-neutral-content w-10 rounded-full">
        <span className="text-3xl">{getInitials(displayName || '?')}</span>
      </div>
    </div>
  );
}
