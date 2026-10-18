import { useGuestAuth } from '../../lib/guestAuth';
import { useEventState } from '../../lib/eventState';
import { updateGuest, getGuestList } from '../../lib/queries';
import { DisplayNameDialog } from './DisplayNameDialog';
export function ModalGuestDisplayNameForm({
  isOpen,
  closeModal,
}: {
  isOpen: boolean;
  closeModal: Function;
}) {
  const { guest, guestList, setGuestList } = useGuestAuth();
  const { event } = useEventState();
  return (
    <DisplayNameDialog
      isOpen={isOpen}
      closeModal={closeModal}
      name={guestList?.find((g) => g.guest_id === guest?.guest_id)?.display_name}
      onSave={async (display_name) => {
        if (!guest || !event) throw new Error('Join first');
        const { error } = await updateGuest({ display_name, guest_id: guest.guest_id });
        if (error) throw error;
        const { data } = await getGuestList(event.event_id);
        if (data) setGuestList(data);
      }}
    />
  );
}
