import Image from 'next/image';
import { getInitials } from '../lib/initials';

export function Avatar({
  displayName,
  avatarUrl,
}: {
  displayName: string | undefined;
  avatarUrl: string | undefined;
}) {
  // normal Avatar
  if (avatarUrl) {
    return (
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <Image
              layout="responsive"
              width="150"
              height="150"
              src={avatarUrl} // avoid abusing GitHub's image hosting
              alt={'picture of ' + displayName}
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
