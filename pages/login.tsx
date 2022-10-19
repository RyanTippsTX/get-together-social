import { useRouter } from 'next/router';
import { useAuth } from '../lib/auth';
import { useForm } from 'react-hook-form';
import Layout from '../components/layout';
import { FormEventHandler } from 'react';

export default function Login() {
  const { session, user, signOut, signInWithMagicLink, signInWithGoogle } = useAuth();

  const router = useRouter();
  if (user) router.push('/dashboard');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  console.log(errors);

  const heading = (
    <div className="py-4">
      <h2 className="mt-6 text-center text-5xl font-bold tracking-tight text-gray-900">🥳</h2>
      <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
        Sign in to your account
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">Initial Sign up is not requied.</p>
    </div>
  );

  const card = (
    <div className="flex w-full flex-col items-center border-opacity-50 px-4 pb-6">
      <div className="card bg-base-100 m-4 w-full max-w-sm shadow">
        <form
          className="card-body"
          noValidate
          onSubmit={handleSubmit((data) => {
            console.log('Form submission data:', data);
            signInWithMagicLink(data);
          })}
        >
          <h2 className="card-title">{'Sign in with an Email Link'}</h2>
          <p>{'No password required.'}</p>

          <div className="form-control w-full">
            <label className="label" htmlFor="email">
              <span className="label-text">Your Email</span>
            </label>

            <input
              className={`input input-bordered w-full ${errors.email && 'border-error'}`}
              type="email"
              id="email"
              placeholder="elon@spacex.com"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value:
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: 'Invalid email address',
                },
                // minLength: { value: 8, message: 'Minimum length is 8' },
              })}
            />
            <div className="text-error px-1 pt-1 text-sm font-semibold">
              {errors.email?.message as string}
            </div>
          </div>

          <div className="card-actions justify-center">
            <button className="btn btn-primary w-full" type="submit">
              Send Email Link
            </button>
          </div>
        </form>

        <div className="divider my-0 mx-8 text-zinc-400">OR</div>

        <form className="card-body" onSubmit={signInWithGoogle as FormEventHandler}>
          <h2 className="card-title">{'Sign In with Google'}</h2>
          <p>{'Requires a Google account.'}</p>
          <div className="card-actions justify-center">
            <button className="btn btn-primary w-full" type="submit">
              Sign In With Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <Layout>
      {heading}
      {card}
    </Layout>
  );
}
