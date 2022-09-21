import { Brand } from './Brand';
import { OptionsButton } from './OptionsButton';
import { Avatar } from './Avatar';
import { useAuth } from '../lib/auth';
import { useProfile } from '../lib/profile';

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
      <OptionsButton />
      <Avatar avatarUrl={profile?.avatar_url} displayName={profile?.display_name} />
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
