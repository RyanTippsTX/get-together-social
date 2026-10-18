import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Layout from '../components/layout';
import { Sun } from '../components/Icons';
import { useAuth } from '../lib/auth';
import { useProfile } from '../lib/profile';
import { createHostProfile } from '../lib/queries';
import { ProfileInputs } from '../lib/forms.types';

export default function Welcome() {
  const router = useRouter();
  const { user, sessionStale } = useAuth();
  const { profile, setProfileStale } = useProfile();
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInputs>();
  useEffect(() => {
    if (profile) void router.replace('/my-events');
    else if (!sessionStale && !user) void router.replace('/login');
  }, [profile, user, sessionStale, router]);
  return (
    <Layout>
      <div className="mx-auto max-w-md py-8">
        <Sun className="mb-5 h-12 w-12 text-[#c99c00]" />
        <h1 className="page-title">Welcome to the table.</h1>
        <p className="subheading">One last thing: what should your guests call you?</p>
        <form
          className="card mt-8 p-6"
          noValidate
          onSubmit={handleSubmit(async (data) => {
            if (!user) return;
            setError('');
            const { error } = await createHostProfile({
              display_name: data.display_name.trim(),
              host_id: user.id,
            });
            if (error) setError('Couldn’t save your name. Please try again.');
            else setProfileStale(true);
          })}
        >
          <label htmlFor="display_name" className="field-label">
            Your name
          </label>
          <input
            id="display_name"
            autoComplete="name"
            placeholder="Alex Morgan"
            className="input w-full"
            {...register('display_name', {
              required: 'Enter your name.',
              maxLength: { value: 60, message: 'Use 60 characters or fewer.' },
              validate: (v) => !!v.trim() || 'Enter your name.',
            })}
          />
          <p className="field-hint">Use a name your guests will recognize.</p>
          {errors.display_name && (
            <p role="alert" className="field-error">
              {errors.display_name.message}
            </p>
          )}
          {error && (
            <p role="alert" className="field-error">
              {error}
            </p>
          )}
          <button className="btn mt-6 w-full" disabled={isSubmitting || !user}>
            {isSubmitting ? 'Saving…' : 'Let’s get started'}
          </button>
        </form>
      </div>
    </Layout>
  );
}
