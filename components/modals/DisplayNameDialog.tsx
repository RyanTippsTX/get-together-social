import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from './Modal';
export function DisplayNameDialog({
  isOpen,
  closeModal,
  name,
  onSave,
}: {
  isOpen: boolean;
  closeModal: Function;
  name?: string | null;
  onSave: (name: string) => Promise<void>;
}) {
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<{ name: string }>();
  useEffect(() => {
    if (isOpen) {
      reset({ name: name || '' });
      setError('');
    }
  }, [isOpen, name, reset]);
  return (
    <Modal isOpen={isOpen} closeModal={closeModal}>
      <form
        className="card-body"
        noValidate
        onSubmit={handleSubmit(async ({ name }) => {
          setError('');
          try {
            await onSave(name.trim());
            closeModal();
          } catch {
            setError('We couldn’t save your name. Please try again.');
          }
        })}
      >
        <h2 className="card-title">What should we call you?</h2>
        <p className="text-muted text-sm">Use a name the other guests will recognize.</p>
        <div>
          <label htmlFor="edit-display-name" className="field-label">
            Display name
          </label>
          <input
            id="edit-display-name"
            autoComplete="name"
            className="input w-full"
            {...register('name', {
              required: 'Enter your name.',
              maxLength: { value: 60, message: 'Use 60 characters or fewer.' },
              validate: (v) => !!v.trim() || 'Enter your name.',
            })}
          />
          {errors.name && (
            <p role="alert" className="field-error">
              {errors.name.message}
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
          <button className="btn" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save name'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
