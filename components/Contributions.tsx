import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Host, Contribution, Contributions } from '../lib/queries.types';
import { useAuth } from '../lib/auth';
import { useEventState } from '../lib/eventState';
import { useGuestAuth } from '../lib/guestAuth';
import { getInitials } from '../lib/initials';
import {
  createRequest,
  createHostContribution,
  createGuestContribution,
  claimRequestAsGuest,
  unclaimRequest,
  convertRequestToHostContribution,
  convertHostContributionToRequest,
  deleteContribution,
} from '../lib/queries';
import { ModalGuestLogin } from './modals/ModalGuestLogin';
import { Dropdown } from './Dropdown';
import { Icon } from './Icons';

type Props = {
  contributions_frozen: boolean;
  contributions_custom_title: string | null;
  contributions: Contributions;
  host: Host;
  onChange: () => Promise<void>;
};
export function ContributionsComponent({
  contributions_frozen,
  contributions_custom_title,
  contributions,
  host,
  onChange,
}: Props) {
  return (
    <section
      className="border-ink/20 bg-cream rounded-2xl border"
      aria-labelledby="contributions-title"
    >
      <div className="px-5 py-6 sm:px-7">
        <h2 id="contributions-title" className="text-2xl sm:text-3xl">
          {contributions_custom_title || 'What’s everyone bringing?'}
        </h2>
        <p className="text-muted mt-2 text-sm">
          {contributions_frozen
            ? 'Claim a requested item to help bring it all together.'
            : 'Pick something below or add your own. A little from everyone goes a long way.'}
        </p>
      </div>
      {contributions.length === 0 && (
        <p className="border-ink/10 text-muted border-t px-5 py-7 text-sm sm:px-7">
          The list is open. Be the first to bring something along.
        </p>
      )}
      <ul>
        {contributions.map((contribution) => (
          <ContributionRow
            key={contribution.contribution_id}
            contribution={contribution}
            host={host}
            onChange={onChange}
          />
        ))}
      </ul>
      <NewContributionForm contributions_frozen={contributions_frozen} onChange={onChange} />
    </section>
  );
}

function ContributionRow({
  contribution,
  host,
  onChange,
}: {
  contribution: Contribution;
  host: Host;
  onChange: () => Promise<void>;
}) {
  const { user } = useAuth();
  const { event } = useEventState();
  const { guest } = useGuestAuth();
  const [guestOpen, setGuestOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const {
    contribution_id,
    description,
    requested,
    contributor_id,
    claimed_comment,
    guests: contributor,
  } = contribution;
  const isHost = !!user && user.id === event?.host_id;
  const isGuest = !!guest && !isHost;
  const openRequest = requested && !contributor_id;
  const canManage = isHost || (isGuest && contributor_id === guest?.guest_id);
  const name = contributor_id ? contributor?.display_name || 'Guest' : host.display_name;
  const mutate = async (action: () => PromiseLike<{ error: unknown }>) => {
    setBusy(true);
    setError('');
    try {
      const result = await action();
      if (result.error) throw result.error;
      await onChange();
    } catch {
      setError('Couldn’t save that change. Please try again.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <li className="contribution-row" aria-busy={busy}>
      <div className="contribution-name">
        {description}
        {claimed_comment && <p className="text-muted mt-1 text-sm">{claimed_comment}</p>}
      </div>
      <div className="contribution-person">
        {openRequest ? (
          <>
            <span className="border-ink/25 h-8 w-8 shrink-0 rounded-full border border-dashed" />
            <span>Requested</span>
          </>
        ) : (
          <>
            <span
              className="bg-butter text-ink inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
              aria-hidden="true"
            >
              {getInitials(name || 'Host')}
            </span>
            <span className="break-words">
              {name}
              {!contributor_id && <span className="text-xs"> · Host</span>}
            </span>
          </>
        )}
      </div>
      <div className="contribution-action">
        {openRequest ? (
          <button
            type="button"
            className="btn btn-sm min-w-[86px]"
            disabled={busy}
            aria-label={`Claim ${description}`}
            onClick={() => {
              if (isHost) void mutate(() => convertRequestToHostContribution({ contribution_id }));
              else if (guest)
                void mutate(() =>
                  claimRequestAsGuest({
                    contribution_id,
                    guest_id: guest.guest_id,
                    claimed_comment: null,
                  })
                );
              else setGuestOpen(true);
            }}
          >
            {busy ? 'Saving…' : 'Claim'}
          </button>
        ) : (
          <span className="badge badge-ghost">
            <Icon name="check" className="h-3.5 w-3.5" />
            {requested ? 'Claimed' : 'Bringing'}
          </span>
        )}
      </div>
      {canManage && (
        <div className="contribution-menu">
          <Dropdown label={`Options for ${description}`}>
            {isHost && !requested && !contributor_id && (
              <button
                disabled={busy}
                onClick={() => void mutate(() => convertHostContributionToRequest(contribution_id))}
              >
                Convert to request
              </button>
            )}
            {isGuest && requested && (
              <button
                disabled={busy}
                onClick={() => void mutate(() => unclaimRequest(contribution_id))}
              >
                Unclaim item
              </button>
            )}
            {(isHost || (isGuest && !requested)) && (
              <button
                disabled={busy}
                className="text-error"
                onClick={() => void mutate(() => deleteContribution(contribution_id))}
              >
                Delete item
              </button>
            )}
          </Dropdown>
        </div>
      )}
      {error && (
        <p role="alert" className="text-error col-span-full text-sm">
          {error}
        </p>
      )}
      <ModalGuestLogin
        isOpen={guestOpen}
        closeModal={() => setGuestOpen(false)}
        onSuccess={() => setGuestOpen(false)}
      />
    </li>
  );
}

function NewContributionForm({
  contributions_frozen,
  onChange,
}: {
  contributions_frozen: boolean;
  onChange: () => Promise<void>;
}) {
  const { user } = useAuth();
  const { event } = useEventState();
  const { guest } = useGuestAuth();
  const [guestOpen, setGuestOpen] = useState(false);
  const [error, setError] = useState('');
  const isHost = !!user && user.id === event?.host_id;
  const itemForm = useForm<{ description: string }>();
  const requestForm = useForm<{ description: string }>();
  const submit = async (description: string, request: boolean) => {
    if (!event) return;
    if (!isHost && !guest) {
      setGuestOpen(true);
      return;
    }
    setError('');
    try {
      const result =
        request && isHost
          ? await createRequest({ event_id: event.event_id, description })
          : isHost
          ? await createHostContribution({ event_id: event.event_id, description })
          : await createGuestContribution({
              event_id: event.event_id,
              description,
              guest_id: guest!.guest_id,
            });
      if (result.error) throw result.error;
      (request ? requestForm : itemForm).reset();
      await onChange();
    } catch {
      setError('Couldn’t add your item. Please try again.');
    }
  };
  const field = (request: boolean) => {
    const form = request ? requestForm : itemForm;
    const id = request ? 'new-request' : 'new-contribution';
    return (
      <form
        noValidate
        onSubmit={form.handleSubmit(({ description }) => submit(description.trim(), request))}
      >
        <label htmlFor={id} className={isHost ? 'field-label' : 'sr-only'}>
          {request ? 'Ask guests to bring something' : 'What are you bringing?'}
        </label>
        {request && (
          <p className="text-muted mb-3 text-sm">Add an item for someone else to claim.</p>
        )}
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id={id}
            placeholder={request ? 'e.g. A bag of ice' : 'I’m bringing…'}
            className="input w-full"
            {...form.register('description', {
              required: 'Add an item first.',
              maxLength: { value: 200, message: 'Use 200 characters or fewer.' },
              validate: (v) => !!v.trim() || 'Add an item first.',
            })}
          />
          <button
            type="submit"
            className={request ? 'btn btn-outline' : 'btn'}
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Adding…' : request ? 'Add request' : 'Add item'}
            <Icon name="plus" className="h-4 w-4" />
          </button>
        </div>
        {form.formState.errors.description && (
          <p role="alert" className="field-error">
            {form.formState.errors.description.message}
          </p>
        )}
      </form>
    );
  };
  return (
    <div className="border-ink/10 space-y-6 border-t p-5 sm:p-7">
      {(isHost || !contributions_frozen) && field(false)}
      {isHost && field(true)}
      {!isHost && contributions_frozen && (
        <p className="text-muted text-sm">
          The host has closed new contributions. You can still claim an available request.
        </p>
      )}
      {error && (
        <p role="alert" className="field-error">
          {error}
        </p>
      )}
      <ModalGuestLogin
        isOpen={guestOpen}
        closeModal={() => setGuestOpen(false)}
        onSuccess={() => setGuestOpen(false)}
      />
    </div>
  );
}
