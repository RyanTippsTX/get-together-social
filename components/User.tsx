import { FormEvent, useEffect, useState } from 'react';
import supabase from '../lib/supabase';

export default function User() {
  const [user, setUser] = useState<any>(undefined);
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.auth.getUser();
      console.log('user:', data.user);
      setUser(data.user);
    };
    fetchData();
  }, []);

  // async function signUp(event: FormEvent) {   // Not used for now
  //   event.preventDefault();

  //   const email = (event.target as HTMLFormElement).email.value;
  //   const displayName = (event.target as HTMLFormElement).displayName.value;

  //   // const { data, error } = await supabase.auth.signUp({
  //   //   email,
  //   //   password: '',
  //   //   options: {
  //   //     data: {
  //   //       first_name: 'John',
  //   //       age: 27,
  //   //     },
  //   //   },
  //   // });

  //   // const email = (event.target as HTMLFormElement).email.value;
  //   // const { data, error } = await supabase.auth.signInWithOtp({
  //   //   email,
  //   //   options: { emailRedirectTo: '/dashboard', shouldCreateUser: false },
  //   // });
  //   // if (error) {
  //   //   console.error(error);
  //   // }
  //   // console.log(data);
  // }

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
  }

  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    console.log(data);
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) console.error(error);
    setUser(undefined);
  }

  return (
    <div>
      {user ? (
        <>
          <h1>User: {user.email}</h1>
          <button
            onClick={signOut}
            className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
          >
            Sign Out
          </button>
        </>
      ) : (
        <>
          {/* <h1 className="font-bold">Sign Up</h1>
          <form onSubmit={signUp}>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" />
            <br />
            <label htmlFor="displayName">Display Name:</label>
            <input type="text" id="displayName" name="displayName" />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Sign Up
            </button>
          </form>
          <br /> */}

          <div className="flex w-full flex-col items-center border-opacity-50">
            <div className="card bg-base-100 m-4 max-w-lg shadow-xl">
              <form className="card-body" onSubmit={signInWithEmail}>
                <h2 className="card-title">{'Sign In with Magic Link'}</h2>
                <p>{'No SignUp Required.'}</p>

                <div className="form-control w-full">
                  <label className="label" htmlFor="email">
                    <span className="label-text">Your Email</span>
                  </label>
                  <label className="input-group">
                    <span>Email</span>
                    <input
                      className="input input-bordered w-full"
                      type="email"
                      id="email"
                      placeholder="elon@tesla.com"
                      name="email"
                    />
                  </label>
                </div>

                <div className="card-actions justify-center">
                  <button className="btn btn-primary" type="submit">
                    Send Magic Link
                  </button>
                </div>
              </form>

              <div className="divider my-0 mx-8 text-zinc-400">OR</div>

              <form className="card-body" onSubmit={signInWithEmail}>
                <h2 className="card-title">{'Sign In with Google'}</h2>
                <p>{'Requires a Google account.'}</p>
                <div className="card-actions justify-center">
                  <form onSubmit={signInWithGoogle}>
                    <button className="btn btn-primary" type="submit">
                      Sign In With Google
                    </button>
                  </form>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
