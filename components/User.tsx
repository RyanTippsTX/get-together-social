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
    <div className="bg-lime-200">
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
          <h1 className="font-bold">Sign Up / Sign In Using a Link Sent to Your Email Inbox:</h1>
          <form onSubmit={signInWithEmail}>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" />
            <button
              className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
              type="submit"
            >
              Send Magic Link
            </button>
          </form>

          <h1 className="font-bold">- OR -</h1>

          <h1 className="font-bold">Sign In Using Google:</h1>
          <form onSubmit={signInWithGoogle}>
            <button
              className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
              type="submit"
            >
              Sign In With Google
            </button>
          </form>
        </>
      )}
    </div>
  );
}
