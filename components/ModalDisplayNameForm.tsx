import { Modal } from './Modal';
import { useAuth } from '../lib/auth';
import { useProfile } from '../lib/profile';
import { updateHostDisplayName } from '../lib/queries';
import { useRouter } from 'next/router';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ProfileInputs } from '../lib/forms.types';

export function ModalDisplayNameForm({
  isOpen,
  closeModal,
}: {
  isOpen: boolean;
  closeModal: Function;
}) {
  const router = useRouter();
  const { session, user, sessionStale, signOut, signInWithEmail, signInWithGoogle } = useAuth();
  const { profile, display_name, profileStale, setProfileStale } = useProfile();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{ display_name: string }>({
    defaultValues: {
      display_name,
    },
  });
  const onSubmit: SubmitHandler<{ display_name: string }> = (data) => {
    // console.log('Form submission data:', data);
    (async () => {
      const { error } = await updateHostDisplayName({ ...data, host_id: user.id });
      if (error) {
        alert('An error has occured');
        console.error(error);
      }
      setProfileStale(true);
      closeModal();
    })();
  };

  return (
    <Modal {...{ isOpen }} {...{ closeModal }}>
      {/* <p>edit your display name !!</p> */}
      {/* <h3 className="text-lg font-bold">Edit your display name:</h3>
      <p className="py-4">
        Youve been selected for a chance to get one year of subscription to use Wikipedia for free!
      </p> */}
      {/* // Main Form Body */}

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="">
        <div className="card-body ">
          <h2 className="card-title">Enter a New Display Name</h2>
          <p></p>

          {/* input title */}

          <label htmlFor="display_name" className="block text-sm font-medium text-gray-700">
            Display Name
          </label>
          <input
            type="text"
            {...register('display_name', {
              required: { value: true, message: 'Required' },
              maxLength: { value: 60, message: 'Too long' },
              // pattern: { value: /[A-Za-z]/i, message: 'Must contain a character' }, // this is done by default when field is required
            })}
            id="display_name"
            placeholder="Alicia Keys"
            autoComplete="name"
            className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <FormError message={errors.display_name?.message as string} />
          <p className="mt-2 text-sm text-gray-500">
            We reccommend using your full name, or whatever nickname you go by. 🥸
          </p>

          {/* end of inputs */}

          {/* submit button */}
          <div className="modal-action">
            <button
              type="submit"
              // className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              className="btn"
            >
              Save
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
