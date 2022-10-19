import { useEffect, useState } from 'react';
import Layout from '../components/layout';
import supabase from '../lib/supabase';
import Image from 'next/image';
import { useAuth } from '../lib/auth';
import { useProfile } from '../lib/profile';
import { createHostProfile } from '../lib/queries';
import { Event, Events } from '../lib/queries.types';
import { EventCard, EventCardCreate } from '../components/EventCard';
import { useRouter } from 'next/router';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ProfileInputs } from '../lib/forms.types';

export default function Welcome() {
  const router = useRouter();
  const { session, user, sessionStale, signOut, signInWithMagicLink, signInWithGoogle } = useAuth();
  const { profile, loading: profileLoading, setProfileStale } = useProfile();

  // route to dashboard if profile is already created
  if (user) {
    router.push('/dashboard');
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProfileInputs>({
    defaultValues: {
      // display_name: '',
    },
  });
  const onSubmit: SubmitHandler<ProfileInputs> = (data) => {
    // console.log('Form submission data:', data);
    if (user) {
      (async () => {
        const { error } = await createHostProfile({ ...data, host_id: user.id });
        if (error) {
          alert('An error has occured');
          console.error(error);
          signOut();
          router.push('/');
        } else {
          setProfileStale();
          router.push('/dashboard');
        }
      })();
    }
  };

  const heading = (
    <div className="py-4">
      <h2 className="mt-6 text-center text-5xl font-bold tracking-tight text-gray-900">🥳</h2>
      <h2 className="mt-6 text-center text-4xl font-bold tracking-tight text-gray-900">
        Welcome !!
      </h2>
      <p className="mt-2 text-center text-gray-600">Wooohhh Party!!!</p>
      {/* <p className="mt-2 text-center text-2xl font-semibold tracking-tight text-gray-900">
        {user.email}
      </p> */}
    </div>
  );
  const card = (
    <div className="pt-10 pb-10 sm:my-0">
      <div className="flex w-full flex-col items-center border-opacity-50 px-4 pb-6">
        {/* Main Form Body */}
        <div className="mt-5 w-full max-w-sm md:mt-0">
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className="overflow-hidden shadow sm:rounded-md">
              <div className="card-body bg-white px-4 py-5 sm:p-6">
                <h2 className="card-title">Enter a Display Name to Continue</h2>
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
                <div className="pt-6">
                  <button
                    type="submit"
                    // className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    className="btn btn-primary w-full"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="px-2 py-4 text-zinc-800">
        {heading}

        {card}
      </div>
    </Layout>
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
