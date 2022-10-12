import { Brand } from './Brand';
import { NavbarOptionsButton } from './NavbarOptionsButton';
import { Avatar } from './Avatar';
import { useAuth } from '../lib/auth';
import { useProfile } from '../lib/profile';
import Link from 'next/link';

export function Navbar() {
  const {
    session,
    user,
    loading: sessionLoading,
    signOut,
    signInWithEmail,
    signInWithGoogle,
  } = useAuth();
  const { profile, loading: profileLoading } = useProfile();

  const navLeft = (
    <div className="flex-1">
      <Brand />
    </div>
  );

  const navRight = (
    <div className="flex-none">
      {user && (
        <>
          <NavbarOptionsButton />
          <Avatar
            profileLoading={profileLoading}
            displayName={profile?.display_name}
            email={user.email}
            avatarUrl={profile?.avatar_url}
          />
        </>
      )}
      {!sessionLoading && !user && (
        <Link href={'/login'}>
          <a className="">
            <div className="flex items-center gap-1">
              <div className="font-medium">Sign In</div>
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
