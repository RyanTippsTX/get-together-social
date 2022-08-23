import { sign } from 'crypto';
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

  // if no user,
  // show sign in button
  // show sign up button

  // if user,
  // show profile pic / name
  // show sign out button

  async function signIn(event: FormEvent) {
    event.preventDefault();

    const email = (event.target as HTMLFormElement).email.value;
    const { data, error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      console.error(error);
    }
    console.log(data);
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) console.log(error);
    setUser(undefined);
  }

  return (
    <div className="bg-lime-200">
      {user ? (
        <>
          <h1>User: {user.email}</h1>
          <button
            onClick={signOut}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign Out
          </button>
        </>
      ) : (
        <>
          <h1>Log In</h1>
          <form onSubmit={signIn}>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Send Magic Link
            </button>
          </form>
        </>
      )}
    </div>
  );
}
