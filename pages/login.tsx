import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Layout from '../components/layout';
import { Flourish, Icon } from '../components/Icons';
import { useAuth } from '../lib/auth';

export default function Login() {
  const { user, signInWithMagicLink, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [googleBusy, setGoogleBusy] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ email: string }>();
  useEffect(() => {
    if (user) void router.replace('/my-events');
  }, [user, router]);
  return (
    <Layout metaTags={{ pageTitle: 'Host login · GetTogether.social' }}>
      <div className="mx-auto grid max-w-4xl items-center gap-10 py-4 md:grid-cols-2 md:gap-16 md:py-14">
        <div>
          <p className="eyebrow">Pull up a chair</p>
          <Flourish />
          <h1 className="page-title">
            Good company
            <br />
            starts with you.
          </h1>
          <p className="subheading">
            Sign in to plan your next get-together, manage your events, and bring your people
            together.
          </p>
          <p className="text-muted mt-6 text-sm">
            First time here? We’ll get you set up as you sign in.
          </p>
        </div>
        <div className="card p-6 sm:p-8">
          <h2 className="text-2xl">Welcome, host.</h2>
          <p className="text-muted mt-2 text-sm">One less password to remember.</p>
          <button
            type="button"
            disabled={googleBusy}
            className="btn btn-outline mt-6 w-full"
            onClick={async () => {
              setGoogleBusy(true);
              setError('');
              try {
                await signInWithGoogle();
              } catch {
                setError('Google sign-in couldn’t start. Please try again.');
                setGoogleBusy(false);
              }
            }}
          >
            <span className="font-bold">G</span>
            {googleBusy ? 'Opening Google…' : 'Continue with Google'}
          </button>
          <div className="divider my-6">or use email</div>
          <form
            noValidate
            onSubmit={handleSubmit(async (data) => {
              setError('');
              setMessage('');
              try {
                await signInWithMagicLink(data);
                setMessage('Check your inbox. Your sign-in link is on its way.');
              } catch {
                setError('We couldn’t send your sign-in link. Please try again.');
              }
            })}
          >
            <label className="field-label" htmlFor="email">
              Email address
            </label>
            <input
              type="email"
              id="email"
              className="input w-full"
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={!!errors.email}
              {...register('email', {
                required: 'Enter your email address.',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email address.',
                },
              })}
            />
            {errors.email && (
              <p role="alert" className="field-error">
                {errors.email.message}
              </p>
            )}
            <button type="submit" disabled={isSubmitting} className="btn mt-4 w-full">
              {isSubmitting ? 'Sending…' : 'Email me a sign-in link'}
              <Icon name="arrow" className="h-4 w-4" />
            </button>
          </form>
          {message && (
            <p role="status" className="text-success mt-4 text-sm">
              {message}
            </p>
          )}
          {error && (
            <p role="alert" className="field-error">
              {error}
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
}
