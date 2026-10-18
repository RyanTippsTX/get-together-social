import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { Inputs } from '../lib/forms.types';
import { Icon } from './Icons';

export function EventForm({
  defaults,
  onSave,
  editing = false,
  cancelHref = '/my-events',
}: {
  defaults?: Partial<Inputs>;
  onSave: (data: Inputs) => Promise<void>;
  editing?: boolean;
  cancelHref?: string;
}) {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      contributions_enabled: true,
      contributions_frozen: false,
      contributions_custom_title_enabled: false,
      ...defaults,
    },
  });
  const [saveError, setSaveError] = useState('');
  const enabled = watch('contributions_enabled');
  const customTitle = watch('contributions_custom_title_enabled');
  const error = (name: keyof Inputs) =>
    errors[name] && (
      <p id={`${name}-error`} role="alert" className="field-error">
        {errors[name]?.message}
      </p>
    );
  return (
    <form
      noValidate
      onSubmit={handleSubmit(async (data) => {
        setSaveError('');
        try {
          await onSave({
            ...data,
            title: data.title.trim(),
            description: data.description.trim(),
            contributions_custom_title: data.contributions_custom_title_enabled
              ? data.contributions_custom_title?.trim()
              : '',
          });
        } catch {
          setSaveError(
            'We couldn’t save your event. Your details are still here—please try again.'
          );
        }
      })}
      className="grid items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-14"
    >
      <aside>
        <p className="eyebrow">The essentials</p>
        <h2 className="text-2xl">Set the scene.</h2>
        <p className="text-muted mt-3 text-sm leading-7">
          A few details are all it takes. Anyone with your link can see the event and join in.
        </p>
        <div className="border-ink/10 bg-cream mt-6 rounded-2xl border p-5">
          <p className="text-sm font-bold">Make it feel like you.</p>
          <p className="text-muted mt-2 text-sm leading-6">
            You can add a cover photo from your event’s options menu after saving.
          </p>
        </div>
      </aside>
      <div className="border-ink/20 bg-cream min-w-0 rounded-2xl border">
        <div className="space-y-6 p-5 sm:p-8">
          <div>
            <label className="field-label" htmlFor="title">
              Give it a name
            </label>
            <input
              id="title"
              className="input w-full"
              placeholder="Sunday potluck, game night, just because…"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? 'title-error' : undefined}
              {...register('title', {
                required: 'Give your event a name.',
                maxLength: { value: 60, message: 'Use 60 characters or fewer.' },
                validate: (v) => !!v.trim() || 'Give your event a name.',
              })}
            />
            {error('title')}
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="date">
                Date
              </label>
              <input
                id="date"
                type="date"
                className="input w-full"
                aria-invalid={!!errors.date}
                {...register('date', { required: 'Choose a date.' })}
              />
              {error('date')}
            </div>
            <div>
              <label className="field-label" htmlFor="time">
                Time <span className="text-muted font-normal">(optional)</span>
              </label>
              <input
                id="time"
                className="input w-full"
                placeholder="4–7 PM, or whenever you can"
                {...register('time', {
                  maxLength: { value: 60, message: 'Use 60 characters or fewer.' },
                })}
              />
              {error('time')}
            </div>
          </div>
          <div>
            <label className="field-label" htmlFor="location">
              Where’s the get-together? <span className="text-muted font-normal">(optional)</span>
            </label>
            <input
              id="location"
              className="input w-full"
              placeholder="An address, a favorite spot, your backyard…"
              {...register('location', {
                maxLength: { value: 100, message: 'Use 100 characters or fewer.' },
              })}
            />
            {error('location')}
          </div>
          <div>
            <label className="field-label" htmlFor="description">
              A little about the plan
            </label>
            <textarea
              id="description"
              rows={5}
              className="form-textarea w-full"
              placeholder="What should your guests know?"
              aria-invalid={!!errors.description}
              {...register('description', {
                required: 'Add a description for your guests.',
                maxLength: { value: 2000, message: 'Use 2,000 characters or fewer.' },
                validate: (v) => !!v.trim() || 'Add a description for your guests.',
              })}
            />
            {error('description')}
            <p className="field-hint">
              Include a few details, a schedule, or a link. Make yourself at home.
            </p>
          </div>
        </div>
        <fieldset className="border-ink/10 border-t p-5 sm:p-8">
          <legend className="sr-only">Contribution settings</legend>
          <h2 className="mb-5 text-2xl">Everyone brings something.</h2>
          <label className="flex cursor-pointer items-start gap-3">
            <input type="checkbox" className="toggle mt-1" {...register('contributions_enabled')} />
            <span>
              <span className="block text-sm font-bold">Enable contributions</span>
              <span className="field-hint block">Guests can add items or claim your requests.</span>
            </span>
          </label>
          {enabled && (
            <div className="border-ink/15 mt-6 space-y-6 border-l pl-5 sm:ml-2 sm:pl-6">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  className="toggle mt-1"
                  {...register('contributions_frozen')}
                />
                <span>
                  <span className="block text-sm font-bold">Only allow requested items</span>
                  <span className="field-hint block">
                    Guests can claim your requests, but can’t add new items.
                  </span>
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  className="toggle mt-1"
                  {...register('contributions_custom_title_enabled')}
                />
                <span>
                  <span className="block text-sm font-bold">Use a custom section title</span>
                  <span className="field-hint block">
                    Try “Dessert potluck” or “Game night essentials”.
                  </span>
                </span>
              </label>
              {customTitle && (
                <div>
                  <label className="field-label" htmlFor="contributions_custom_title">
                    Contribution section title
                  </label>
                  <input
                    className="input w-full"
                    id="contributions_custom_title"
                    placeholder="What’s everyone bringing?"
                    {...register('contributions_custom_title', {
                      maxLength: { value: 60, message: 'Use 60 characters or fewer.' },
                    })}
                  />
                  {error('contributions_custom_title')}
                </div>
              )}
            </div>
          )}
        </fieldset>
        <div className="border-ink/10 flex flex-wrap items-center justify-end gap-3 border-t p-5 sm:px-8">
          {saveError && (
            <p role="alert" className="text-error mb-2 w-full text-sm">
              {saveError}
            </p>
          )}
          <Link className="btn btn-ghost" href={cancelHref}>
            Cancel
          </Link>
          <button type="submit" className="btn" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : editing ? 'Save changes' : 'Create event'}
            <Icon name="arrow" />
          </button>
        </div>
      </div>
    </form>
  );
}
