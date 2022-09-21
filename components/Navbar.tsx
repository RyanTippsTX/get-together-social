import { Brand } from './Brand';
import { useAuth } from '../lib/auth';

export function Navbar() {
  return (
    <div className="navbar border-b-[1px] border-zinc-200 bg-white">
      <div className="container mx-auto">
        <div className="flex-1">
          <Brand />
        </div>
        <div className="flex-none">
          <div className="dropdown dropdown-end">
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
              className="menu menu-compact dropdown-content rounded-box mt-3 w-auto bg-white p-2 shadow"
            >
              <li>
                <a className="justify-between">
                  Profile
                  {/* <span className="badge">New</span> */}
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
        </div>
      </div>
    </div>
  );
}
