import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from './Modal';
import { softDeleteEvent } from '../../lib/queries';
import { Event } from '../../lib/queries.types';
export function ModalConfrimDeleteEvent({
  event,
  isOpen,
  closeModal,
  onSuccess,
}: {
  event: Event;
  isOpen: boolean;
  closeModal: Function;
  onSuccess: Function;
}) {
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<{ confirmation: string }>();
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
        onSubmit={handleSubmit(async () => {
          setError('');
          const { error } = await softDeleteEvent(event.event_id);
          if (error) {
            setError('The event couldn’t be deleted. Please try again.');
            return;
          }
          closeModal();
          onSuccess();
        })}
      >
        <h2 className="card-title">Delete this event?</h2>
        <p className="text-muted text-sm leading-relaxed">
          This will remove <strong className="text-ink">{event.title}</strong> and its cover photo.
          This can’t be undone.
        </p>
        <div>
          <label htmlFor="delete-confirmation" className="field-label">
            Type DELETE to confirm
          </label>
          <input
            id="delete-confirmation"
            autoComplete="off"
            className="input w-full"
            {...register('confirmation', {
              validate: (v) => v === 'DELETE' || 'Type DELETE to confirm.',
            })}
          />
          {errors.confirmation && (
            <p role="alert" className="field-error">
              {errors.confirmation.message}
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
          <button className="btn btn-warning" disabled={isSubmitting}>
            {isSubmitting ? 'Deleting…' : 'Delete event'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
