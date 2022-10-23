import { Host, Event, Guest, Contribution, Contributions } from '../lib/queries.types';
// import { ContributionOptionsButton } from './ContributionOptionsButton';
import { useAuth } from '../lib/auth';
import { useProfile } from '../lib/profile';
import { useEventState } from '../lib/eventState';
import { useGuestAuth } from '../lib/guestAuth';
import { useForm } from 'react-hook-form';
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

// component assumes that contributions are enabled if its being called to render
export function ContributionsComponent({
  contributions_frozen,
  contributions_custom_title,
  contributions,
  host,
}: {
  contributions_frozen: boolean;
  contributions_custom_title: string | null;
  contributions: Contributions; // array will be empty if there are no contributions
  host: Host;
}) {
  const { session, user, sessionStale, signOut, signInWithMagicLink, signInWithGoogle } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { guest, setGuest, guestList, setGuestList } = useGuestAuth();
  const { event, setEvent } = useEventState();

  const isHost = user && user.id === event?.host_id;
  const isGuest = guest && !isHost; // let host account take precedence in event of a shared device
  const isSpectator = !isHost && !isGuest; // note, this could be an authenticated host account for a different event, or a non-authenticated page viewer.

  return (
    <div className="flex flex-col items-center pb-6 ">
      <div className="w-full py-2">
        <div className="mx-2 flex items-center gap-1 pb-1">
          <div className="text-dark  text-xl font-bold">
            {contributions_custom_title || 'Contribtutons'}
          </div>
          {isSpectator && <Tooltip message="Log in as a Guest to participate" />}
        </div>
        <div>
          {contributions?.map((contribution, i) => (
            <ContributionsTableRow
              {...{ contribution, i, host }}
              key={contribution.contribution_id}
            />
          ))}
        </div>
        {<NewContributionForm {...{ contributions_frozen }} />}
      </div>
    </div>
  );
}

function Tooltip({ message }: { message: string }) {
  const icon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-6 w-6 text-zinc-400"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
      />
    </svg>
  );

  const popup = (
    <div
      className="text-md invisible absolute left-2/4 bottom-full mb-1
       w-40 -translate-x-2/4 
      items-center rounded
      bg-zinc-700 p-2 font-medium text-zinc-100 shadow hover:visible group-hover:visible"
    >
      <div className="">{message}</div>
    </div>
  );
  return (
    <div className="group relative px-1">
      {icon}
      {popup}
    </div>
  );
}

function ContributionsTableRow({
  i,
  contribution: {
    contribution_id,
    created_at,
    event_id,
    description,
    requested,
    contributor_id,
    claimed_comment,
    guests: contributor,
  },
  host,
}: {
  i: number;
  contribution: Contribution;
  host: Host;
}) {
  const { session, user, sessionStale, signOut, signInWithMagicLink, signInWithGoogle } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { guest, setGuest, guestList, setGuestList } = useGuestAuth();
  const { event, setEvent } = useEventState();

  // user authorization status for actions:
  const isHost = user && user.id === event?.host_id;
  const isGuest = guest && !isHost; // let host account take precedence in event of a shared device
  const isSpectator = !isHost && !isGuest; // note, this could be an authenticated host account for a different event, or a non-authenticated page viewer.

  // contributions will either be:
  // * Committed by the host   // request false, contributor null
  const committedByHost = !requested && !contributor_id;
  // * Committed by a guest   // request false, contributor 1234
  const committedByGuest = !requested && contributor_id;
  // * Requested by the host
  //     * Claimed by no one   // requested true, contributor null
  const requestUnclaimed = requested && !contributor_id;
  //     * Claimed by a guest   // request true, contributor 1234
  const requestClaimedByGuest = requested && contributor_id;
  //     * Claimed by N guests   // future feature, for now host will need to make multiple requests if wanting to do that
  //     * Claimed by the host.   // this is not a request, so convert

  const claimButton = (
    <div
      className="btn btn-sm gap-1"
      onClick={() => {
        if (isGuest) {
          (async () => {
            const { data, error } = await claimRequestAsGuest({
              contribution_id,
              claimed_comment: null,
              guest_id: guest.guest_id,
            });
          })();
        }
        if (isHost) {
          (async () => {
            const { data, error } = await convertRequestToHostContribution({
              contribution_id,
            });
          })();
        }
      }}
    >
      <p className="">Claim</p>
      <p className="text-2xl">🙋🏻</p>
      {/* <p className="block text-2xl">✋🏻</p> */}
    </div>
  );

  const optionsButton = (
    <div className="dropdown dropdown-end flex">
      {/* button */}
      <div tabIndex={0} className="btn btn-square btn-ghost btn-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="inline-block h-5 w-5 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
          ></path>
        </svg>
      </div>
      {/* dropdown */}
      <ul
        tabIndex={0}
        className="menu menu-compact dropdown-content rounded-box absolute top-full right-0 mt-3 w-auto min-w-max border-[1px] bg-white p-2 shadow"
      >
        {/* Host options */}
        {isHost && (
          <li>
            <button
              onClick={() => {
                deleteContribution(contribution_id);
              }}
              className=""
            >
              Delete
            </button>
          </li>
        )}
        {isHost && !contributor_id && !requested && (
          <li>
            <button
              onClick={() => {
                convertHostContributionToRequest(contribution_id);
              }}
              className=""
            >
              Convert to Request
            </button>
          </li>
        )}
        {/* Guest options */}
        {isGuest && !requested && (
          <li>
            <button
              onClick={() => {
                deleteContribution(contribution_id);
              }}
              className=""
            >
              Delete
            </button>
          </li>
        )}
        {isGuest && requested && (
          <li>
            <button
              onClick={() => {
                unclaimRequest(contribution_id);
              }}
              className=""
            >
              Unclaim
            </button>
          </li>
        )}
      </ul>
    </div>
  );

  const descriptionDisplay = (
    <div className="flex grow flex-wrap items-center">
      <div>{description}</div>
      {requestUnclaimed && <div className="badge mx-1">Requested</div>}
      {requestClaimedByGuest &&
        (claimed_comment ? (
          <div className="badge badge-ghost mx-1">Claimed as:</div>
        ) : (
          <div className="badge badge-ghost mx-1">Claimed</div>
        ))}
      <div>{claimed_comment}</div>
    </div>
  );
  const contributorDisplay = (
    <div className="w-28 flex-none text-ellipsis tracking-tighter">
      {(committedByGuest || requestClaimedByGuest) && contributor.display_name}
      {committedByHost && host.display_name}
      {requested && !contributor_id && claimButton}
    </div>
  );

  const actions = (
    <div className="flex">
      <div className="w-8">
        {(isHost || (isGuest && contributor_id === guest.guest_id)) && optionsButton}
      </div>
    </div>
  );

  return (
    <div className="min-h-12 flex flex-nowrap items-center gap-2 border-t-[1px] border-zinc-200 bg-zinc-50 py-1 px-2 sm:mx-2 ">
      {descriptionDisplay}
      {contributorDisplay}
      {actions}
    </div>
  );
}

function NewContributionForm({ contributions_frozen }: { contributions_frozen: boolean }) {
  const { session, user, sessionStale, signOut, signInWithMagicLink, signInWithGoogle } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { guest, setGuest, guestList, setGuestList } = useGuestAuth();
  const { event, setEvent } = useEventState();

  const { event_id } = event! || {}; // safe to assume event exists if this page is rendering
  const { guest_id } = guest! || {}; // kinda dangerous, but value is only consumed by functions available when there is a guest user

  const isHost = user && user.id === event?.host_id;
  const isGuest = guest && !isHost; // let host account take precedence in event of a shared device
  const isSpectator = !isHost && !isGuest; // note, this could be an authenticated host account for a different event, or a non-authenticated page viewer.

  // form state for New Item
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // form state for New Request
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    reset: reset2,
  } = useForm();

  const NewItemForm = (
    <>
      <div className="pt-3">
        {/* {isHost && (
          // this label is only necesary when disambiguating from the new request form for event hosts
          <div className=" mx-1 flex items-center gap-1 pb-1">
            <div className="text-dark text-md font-bold">New entry in your name</div>
            <Tooltip message="This implies y" />
          </div>
        )} */}
        <form
          className=" flex w-full gap-2"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(({ description }) => {
            // console.log('New Item submission data:', data);
            if (isSpectator) {
              // promt guest login
              return; // for now
            }
            reset();
            if (isHost) {
              createHostContribution({
                event_id,
                description,
              });
            }
            if (isGuest) {
              createGuestContribution({
                event_id,
                description,
                guest_id,
              });
            }
          })}
        >
          <input
            type="text"
            placeholder="Add an item..."
            className="input input-bordered w-full"
            {...register('description', {
              required: { value: true, message: 'Required' },
              maxLength: { value: 200, message: 'Too long' },
              // pattern: { value: /[A-Za-z]/i, message: 'Must contain a character' }, // this is done by default when field is required
            })}
          />
          {/* <div className="btn btn-primary text-3xl">🕊</div> */}
          <button type="submit" className="btn gap-2 text-lg">
            Submit
          </button>
        </form>
      </div>
    </>
  );
  const NewRequestForm = (
    <>
      <div className="pt-8">
        {/* label */}
        <div className=" mx-1 flex items-center gap-1 pb-1">
          <div className="text-dark text-md font-bold tracking-tight">Make a Request</div>
          <Tooltip message="Requests can be claimed by guests" />
        </div>
        {/* form */}
        <form
          className=" flex w-full gap-2"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit2(({ description }) => {
            reset2();
            // console.log('New Request submission data:', data);
            if (isHost) {
              createRequest({
                event_id,
                description,
              });
            }
          })}
        >
          <input
            type="text"
            placeholder="Add a request..."
            className="input input-bordered w-full"
            {...register2('description', {
              required: { value: true, message: 'Required' },
              maxLength: { value: 200, message: 'Too long' },
              // pattern: { value: /[A-Za-z]/i, message: 'Must contain a character' }, // this is done by default when field is required
            })}
          />
          {/* <div className="btn btn-primary text-3xl">🕊</div> */}
          <button type="submit" className="btn gap-2 text-lg">
            Submit
          </button>
        </form>
      </div>
    </>
  );

  return (
    <div className="px-2">
      {(isHost || (isGuest && !contributions_frozen)) && NewItemForm}
      {isHost && NewRequestForm}
    </div>
  );
}
