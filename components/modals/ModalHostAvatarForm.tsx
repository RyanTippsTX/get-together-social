import { updateHostAvatar } from '../../lib/storage';
import { useProfile } from '../../lib/profile';
import { PhotoUploadDialog } from './PhotoUploadDialog';
export function ModalHostAvatarForm({
  isOpen,
  closeModal,
}: {
  isOpen: boolean;
  closeModal: Function;
}) {
  const { profile, setProfileStale } = useProfile();
  return (
    <PhotoUploadDialog
      isOpen={isOpen}
      closeModal={closeModal}
      title="A familiar face."
      hasPhoto={!!profile?.avatar_url}
      onSave={async (avatarFile) => {
        if (!profile) throw new Error('Profile not ready');
        await updateHostAvatar({ host_id: profile.host_id, avatarFile });
        setProfileStale(true);
      }}
    />
  );
}
