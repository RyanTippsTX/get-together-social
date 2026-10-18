import Image from 'next/image';
import { useState } from 'react';
import { getInitials } from '../lib/initials';
import { useAuth } from '../lib/auth';
import { Dropdown } from './Dropdown';
import { ModalHostDisplayNameForm } from './modals/ModalHostDisplayNameForm';
import { ModalHostAvatarForm } from './modals/ModalHostAvatarForm';

export function AvatarPlaceholder({
  displayName,
  email,
}: {
  displayName?: string;
  email?: string;
}) {
  return (
    <span className="bg-lemonade inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold">
      {getInitials(displayName || email || '?')}
    </span>
  );
}
export function Avatar({ avatarUrl, displayName }: { avatarUrl?: string; displayName: string }) {
  return avatarUrl ? (
    <span className="relative block h-10 w-10 overflow-hidden rounded-full">
      <Image src={avatarUrl} alt="" fill sizes="40px" className="object-cover" />
    </span>
  ) : (
    <AvatarPlaceholder displayName={displayName} />
  );
}
export function AvatarDropdown({
  displayName,
  email,
  avatarUrl,
}: {
  profileLoading: boolean;
  displayName?: string;
  email?: string;
  avatarUrl?: string;
}) {
  const { signOut } = useAuth();
  const [photoOpen, setPhotoOpen] = useState(false);
  const [nameOpen, setNameOpen] = useState(false);
  return (
    <>
      <Dropdown
        label="Your account"
        trigger={<Avatar avatarUrl={avatarUrl} displayName={displayName || email || '?'} />}
      >
        <div className="border-ink/10 border-b px-3 py-3">
          <p className="break-words font-semibold">{displayName}</p>
          <p className="text-muted mt-1 break-all text-xs">{email}</p>
        </div>
        <button onClick={() => setNameOpen(true)}>Edit display name</button>
        <button onClick={() => setPhotoOpen(true)}>Change profile photo</button>
        <button onClick={() => signOut()}>Sign out</button>
      </Dropdown>
      <ModalHostDisplayNameForm isOpen={nameOpen} closeModal={() => setNameOpen(false)} />
      <ModalHostAvatarForm isOpen={photoOpen} closeModal={() => setPhotoOpen(false)} />
    </>
  );
}
