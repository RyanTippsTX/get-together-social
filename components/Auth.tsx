import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabase';

export default function User() {
  const [user, setUser] = useState<any>(undefined);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.auth.getUser();
      // console.log('user:', data.user);
      setUser(data.user);
    };
    fetchData();
  }, []);

  async function signInWithEmail(event: FormEvent) {
    event.preventDefault();
    const email = (event.target as HTMLFormElement).email.value;
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: '/dashboard', shouldCreateUser: true },
    });
    if (error) {
      console.error('signin result error:', error);
    }
    // console.log('signin result data:', data); // returns null user object since not user is not yet signed-in

    // No redirect, stat on auth page
    // Toast: "Email sent to ___@gmail.com !"
  }

  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    console.log(data);
    router.push('/dashboard');
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) console.error(error);
    setUser(undefined);
    router.push('/');
  }

  if (user) {
    const LogoutButton = (
      <>
        <h1>User: {user.email}</h1>
        <button
          onClick={signOut}
          className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
        >
          Sign Out
        </button>
      </>
    );
    router.push('/dashboard');
    return LogoutButton; // shouldn't ever see this, above line should redirect
  }

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
