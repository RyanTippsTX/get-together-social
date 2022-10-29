import Layout from '../components/layout';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/auth';
import { useEffect } from 'react';
import supabase from '../lib/supabase';

export default function Goodbye() {
  const { session, sessionStale, user, signOut, signInWithMagicLink, signInWithGoogle } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if ((!user || !session) && !sessionStale) {
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionStale]);

  const deleteCurrentUser = async () => {
    if (!user || !session) {
      return;
    }
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/hosts/${user.id}`, {
      method: 'DELETE',
      headers: new Headers({
        Authorization: session.access_token,
      }),
    })
      .then((res) => {
        if (res.status === 204) {
          // signOut();
          // supabase.auth.refreshSession();
          router.push('/');
          return;
        } else {
          router.push('/my-events');
          throw new Error('Something went wrong on api server!');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Layout>
      <div className="xs:min-h-[45rem] mx-auto flex min-h-[35rem] max-w-md flex-col  gap-6 pt-10">
        <h1 className=" text-center text-5xl font-bold tracking-tight text-zinc-700 ">
          {"Well, It's Been Fun"}
        </h1>
        <h2 className=" text-justify text-xl  tracking-tight text-zinc-700 ">
          Click below to delete your account and all associated events.
        </h2>
        <button
          onClick={() => {
            deleteCurrentUser();
            signOut();
            // console.log({
            //   url: process.env.NEXT_PUBLIC_BACKEND_URL,
            //   user_id: user?.id,
            //   token: session?.access_token,
            // });
          }}
          className="btn btn-warning w-full"
        >
          Yes, Delete Everything
        </button>
        {/* GetTogether.social launched on September X, 2022 */}
      </div>
    </Layout>
  );
}
