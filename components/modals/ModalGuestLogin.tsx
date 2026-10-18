import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from './Modal';
import { createGuest, getGuestList } from '../../lib/queries';
import { useGuestAuth } from '../../lib/guestAuth';
import { useEventState } from '../../lib/eventState';

export function ModalGuestLogin({
  isOpen,
  closeModal,
  onSuccess,
}: {
  isOpen: boolean;
  closeModal: Function;
  onSuccess: Function;
}) {
  const { setGuest, guestList, setGuestList } = useGuestAuth();
  const { event } = useEventState();
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<{ display_name: string }>();
  useEffect(() => {
    if (isOpen) {
      reset();
      setError('');
    }
  }, [isOpen, reset]);
  return (
    <Modal isOpen={isOpen} closeModal={closeModal}>
      <form
        className="card-body"
        noValidate
        onSubmit={handleSubmit(async ({ display_name }) => {
          if (!event) return;
          setError('');
          const name = display_name.trim();
          const returningGuest = guestList?.find((g) => g.display_name === name);
          if (returningGuest) {
            setGuest({ guest_id: returningGuest.guest_id });
            onSuccess();
            closeModal();
            return;
          }
          const { data, error } = await createGuest({
            event_id: event.event_id,
            display_name: name,
          });
          if (error || !data) {
            setError('We couldn’t join the event. Please try again.');
            return;
          }
          const { data: guests } = await getGuestList(event.event_id);
          setGuestList(guests || []);
          setGuest({ guest_id: data.guest_id });
          onSuccess();
          closeModal();
        })}
      >
        <div>
          <p className="eyebrow">You’re in good company</p>
          <h2 className="card-title">Make yourself at home.</h2>
        </div>
        <p className="text-muted text-sm leading-relaxed">
          Enter your name to add or claim a contribution. No account or password needed.
        </p>
        <div>
          <label htmlFor="guest-name" className="field-label">
            Your name
          </label>
          <input
            id="guest-name"
            className="input w-full"
            placeholder="e.g. Alex Morgan"
            list="returning-guests"
            autoComplete="name"
            {...register('display_name', {
              required: 'Enter your name.',
              maxLength: { value: 60, message: 'Use 60 characters or fewer.' },
              validate: (value) => !!value.trim() || 'Enter your name.',
            })}
          />
          <datalist id="returning-guests">
            {guestList?.map((g) => (
              <option key={g.guest_id} value={g.display_name} />
            ))}
          </datalist>
          <p className="field-hint">Already joined? Choose the same name you used before.</p>
          {errors.display_name && (
            <p role="alert" className="field-error">
              {errors.display_name.message}
            </p>
          )}
        </div>
        {error && (
          <p role="alert" className="field-error">
            {error}
          </p>
        )}
        <div className="modal-action">
          <button type="button" className="btn btn-ghost" onClick={() => closeModal()}>
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting || !event} className="btn">
            {isSubmitting ? 'Joining…' : 'Join as a guest'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
