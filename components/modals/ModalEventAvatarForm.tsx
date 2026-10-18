import { updateEventAvatar } from '../../lib/storage';
import { Event } from '../../lib/queries.types';
import { getEvent } from '../../lib/queries';
import { useEventState } from '../../lib/eventState';
import { PhotoUploadDialog } from './PhotoUploadDialog';
export function ModalEventAvatarForm({
  event,
  onSuccess,
  isOpen,
  closeModal,
}: {
  event: Event;
  onSuccess: Function;
  isOpen: boolean;
  closeModal: Function;
}) {
  const { setEvent } = useEventState();
  return (
    <PhotoUploadDialog
      isOpen={isOpen}
      closeModal={closeModal}
      title="Set the scene."
      hasPhoto={!!event.photo_url}
      onSave={async (avatarFile) => {
        await updateEventAvatar({ event_id: event.event_id, avatarFile });
        const { data } = await getEvent({ event_id: event.event_id });
        if (data) setEvent(data);
        onSuccess();
      }}
    />
  );
}
