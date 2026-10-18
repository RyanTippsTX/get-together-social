import { useAuth } from '../../lib/auth';
import { useProfile } from '../../lib/profile';
import { updateHostDisplayName } from '../../lib/queries';
import { DisplayNameDialog } from './DisplayNameDialog';
export function ModalHostDisplayNameForm({
  isOpen,
  closeModal,
}: {
  isOpen: boolean;
  closeModal: Function;
}) {
  const { user } = useAuth();
  const { profile, setProfileStale } = useProfile();
  return (
    <DisplayNameDialog
      isOpen={isOpen}
      closeModal={closeModal}
      name={profile?.display_name}
      onSave={async (display_name) => {
        if (!user) throw new Error('Sign in first');
        const { error } = await updateHostDisplayName({ display_name, host_id: user.id });
        if (error) throw error;
        setProfileStale(true);
      }}
    />
  );
}
