import { Modal } from './Modal';
import { updateGuest } from '../../lib/queries';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useGuestAuth } from '../../lib/guestAuth';
import { useEventState } from '../../lib/eventState';
import { useAppLoading } from '../../lib/appLoading';
import { Host, Event, Guest, Contribution, Contributions } from '../../lib/queries.types';
import { useEffect } from 'react';

export function ModalGuestDisplayNameForm({
  isOpen,
  closeModal,
}: // onSuccess,
{
  isOpen: boolean;
  closeModal: Function;
  // onSuccess: Function;
}) {
  const { guest, setGuest, guestList, setGuestList } = useGuestAuth();
  const { event } = useEventState();
  const { appLoading, setAppLoading } = useAppLoading();

  const returningGuestUser = guestList?.find((g) => g.guest_id === guest?.guest_id);

  console.log('user:', returningGuestUser?.display_name);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<{ display_name: string }>({
    defaultValues: {
      display_name: returningGuestUser?.display_name,
    },
  });
  const onSubmit: SubmitHandler<{ display_name: string }> = ({ display_name }) => {
    if (!event) return;
    // console.log('Form submission data:', data);
    closeModal();
    (async () => {
      if (!guest) return;
      setAppLoading(true);

      await updateGuest({ guest_id: guest.guest_id, display_name });
      setAppLoading(false);
    })();
  };

  // clear previous form state anytime the modal is opened
  useEffect(() => {
    if (isOpen) {
      reset(); // note, this resets values to their originally defined default value, the default value expression is not re-evaluated
    }
  }, [isOpen, reset, guest, guestList]);

  return (
    <Modal {...{ isOpen }} {...{ closeModal }}>
      {/* <p>edit your display name !!</p> */}
      {/* <h3 className="text-lg font-bold">Edit your display name:</h3>
      <p className="py-4">
        Youve been selected for a chance to get one year of subscription to use Wikipedia for free!
      </p> */}
      {/* // Main Form Body */}

      <form autoComplete="off" noValidate onSubmit={handleSubmit(onSubmit)} className="">
        <div className="card-body ">
          <h2 className="card-title">Edit Your Display Name</h2>
          {/* <pre>{JSON.stringify(returningGuestUser, null, 2)}</pre> */}
          <p>
            Your Display Name is your guest log-in username and is shown with any contributions you
            make in the {event?.contributions_custom_title || 'Guest Contribtutons'}.
          </p>

          {/* input title */}

          {/* <label htmlFor="display_name" className="block text-sm font-medium text-gray-700">
            Display Name
          </label> */}
          <input
            list="guests"
            // type="text"
            {...register('display_name', {
              required: { value: true, message: 'Required' },
              maxLength: { value: 60, message: 'Too long' },
              // pattern: { value: /[A-Za-z]/i, message: 'Must contain a character' }, // this is done by default when field is required
            })}
            id="display_name"
            placeholder="Your Name"
            // autoComplete="nope"
            className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <datalist id="guests">
            {guestList &&
              Array.from(guestList.keys()).map((display_name) => {
                return <option key={display_name} value={display_name}></option>;
              })}
          </datalist>

          <FormError message={errors.display_name?.message as string} />
          <p className="mt-2 text-sm text-gray-500">
            We reccommend using your full name, or any nickname that uniquely identifies you from
            other guests. 🥸
          </p>

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
              Save
            </button>
          </div>
          {/* <h2 className="card-title">Hosts</h2>
          <p>
            Your Login is <a>here</a>
          </p> */}
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
