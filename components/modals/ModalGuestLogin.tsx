import { Modal } from './Modal';
import { createGuest } from '../../lib/queries';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useGuestAuth } from '../../lib/guestAuth';
import { useEventState } from '../../lib/eventState';
import { useAppLoading } from '../../lib/appLoading';
import { Host, Event, Guest, Contribution, Contributions } from '../../lib/queries.types';

export function ModalGuestLogin({
  isOpen,
  closeModal,
  onSuccess,
}: {
  isOpen: boolean;
  closeModal: Function;
  onSuccess: Function;
}) {
  const { guest, setGuest, guestList, setGuestList } = useGuestAuth();
  const { event } = useEventState();
  const { appLoading, setAppLoading } = useAppLoading();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{ display_name: string }>({
    defaultValues: {
      // display_name: guest,
    },
  });
  const onSubmit: SubmitHandler<{ display_name: string }> = ({ display_name }) => {
    if (!event) return;
    const { event_id } = event;
    // console.log('Form submission data:', data);
    closeModal();
    (async () => {
      const returningGuestUser = guestList?.find((g) => g.display_name === display_name);
      if (returningGuestUser) {
        // returning user
        const { guest_id } = returningGuestUser;
        setGuest({ guest_id });
        return;
      } else {
        // new user
        setAppLoading(true);
        const { data, error } = await createGuest({
          event_id,
          display_name,
        });
        setAppLoading(false);
        if (error) {
          console.error(error);
          setGuest(null);
          return;
        }
        setGuest(data);
      }
    })();
  };

  // guestList && console.log([...guestList?.values()]);
  console.log(guestList);

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
          <h2 className="card-title">Guest Login</h2>
          <p>
            Log in with your name to participate in the{' '}
            {event?.contributions_custom_title || 'Guest Contribtutons'}. No password is required.
          </p>
          <p>Names are suggested for returning users. New users must type in their name.</p>

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
              guestList.map(({ display_name }) => {
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
              Log In
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
