import { Modal } from './Modal';
import { useAuth } from '../../lib/auth';
import { useProfile } from '../../lib/profile';
import { updateHostDisplayName, softDeleteEvent } from '../../lib/queries';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Event } from '../../lib/queries.types';
import { useEffect } from 'react';

export function ModalConfrimDeleteEvent({
  event,
  isOpen,
  closeModal,
}: {
  event: Event;
  isOpen: boolean;
  closeModal: Function;
}) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors },
  } = useForm<{ confirm_delete: string }>({
    defaultValues: {},
  });

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit: SubmitHandler<{ confirm_delete: string }> = (data) => {
    // console.log('Form submission data:', data);
    // double check the validation...
    if (data.confirm_delete === 'DELETE') {
      (async () => {
        const { error } = await softDeleteEvent(event.event_id);
        if (error) {
          alert('An error has occured');
          console.error(error);
        }
        closeModal();
      })();
    }
  };

  console.log('ERRORS', errors.confirm_delete);
  return (
    <Modal {...{ isOpen }} {...{ closeModal }}>
      {/* <p>edit your display name !!</p> */}
      {/* <h3 className="text-lg font-bold">Edit your display name:</h3>
      <p className="py-4">
        Youve been selected for a chance to get one year of subscription to use Wikipedia for free!
      </p> */}
      {/* // Main Form Body */}

      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)} className="">
        <div className="card-body ">
          <h2 className="card-title ">
            {/* <span className="underline">Warning:</span> */}
            Confrim Delete
          </h2>

          <p className="text-base">
            {`Are you sure you want to delete your event`}{' '}
            <span className="font-semibold text-red-600">{event.title}</span>
            {`? `}
            {`This can't be undone.`}
          </p>

          {/* input title */}

          <label htmlFor="confirm_delete" className="block text-sm font-semibold text-gray-700">
            Type DELETE to continue.
          </label>
          <input
            type="text"
            {...register('confirm_delete', {
              required: { value: true, message: 'Required' },
              validate: (value) => value === 'DELETE' || 'Invalid entry',
            })}
            id="confirm_delete"
            // placeholder=""

            className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />

          <FormError message={errors.confirm_delete?.message as string} />

          {/* end of inputs */}

          {/* action buttons */}
          <div className="modal-action">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // console.log('clicked button');
                closeModal();
              }}
              className="btn btn-ghost"
            >
              Cancel
            </button>

            <button
              type="submit"
              // className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              className="btn"
            >
              Delete
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

function FormError({ message }: { message: string | undefined | null }) {
  if (message) {
    return (
      <div className="text-error px-1 pt-1 text-sm font-semibold">
        {/* {errors.email?.message as string} */}
        {message}
      </div>
    );
  }
  return <></>;
}
