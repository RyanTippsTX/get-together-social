// import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/auth';

export default function AuthForm() {
  const { session, user, signOut, signInWithEmail, signInWithGoogle } = useAuth();

  const router = useRouter();
  if (user) router.push('/dashboard');

  return (
    <div>
      <div className="py-4">
        <h2 className="mt-6 text-center text-5xl font-bold tracking-tight text-gray-900">🥳</h2>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">Initial Sign up is not requied.</p>
      </div>

      <div className="flex w-full flex-col items-center border-opacity-50 px-4 pb-6">
        <div className="card bg-base-100 m-4 w-full max-w-sm shadow-xl">
          <form className="card-body" onSubmit={signInWithEmail}>
            <h2 className="card-title">{'Sign in with an Email Link'}</h2>
            <p>{'No password required.'}</p>

            <div className="form-control w-full">
              <label className="label" htmlFor="email">
                <span className="label-text">Your Email</span>
              </label>

              <input
                className="input input-bordered w-full"
                type="email"
                id="email"
                placeholder="elon@spacex.com"
                name="email"
              />
            </div>

            <div className="card-actions justify-center">
              <button className="btn btn-primary w-full" type="submit">
                Send Email Link
              </button>
            </div>
          </form>

          <div className="divider my-0 mx-8 text-zinc-400">OR</div>

          <form className="card-body" onSubmit={signInWithGoogle}>
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
    </div>
  );
}
