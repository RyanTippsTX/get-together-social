import { Host, Event, Guest, Contribution, Contributions } from '../lib/queries.types';
import { ContributionOptionsButton } from './ContributionOptionsButton';
import { useAuth } from '../lib/auth';
import { useProfile } from '../lib/profile';
import { useEventState } from '../lib/eventState';
import { useGuestAuth } from '../lib/guestAuth';

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
  contribution,
  host,
}: {
  i: number;
  contribution: Contribution;
  host: Host;
}) {
  const {
    contribution_id,
    created_at,
    event_id,
    description,
    requested,
    contributor_id,
    claimed_comment,
    guests: guest,
  } = contribution;
  // const { avatar_url, display_name } = host;

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
    <div className="btn btn-sm gap-1">
      <p className="">Claim</p>
      <p className="text-2xl">🙋🏻</p>
      {/* <p className="block text-2xl">✋🏻</p> */}
    </div>
  );

  const item = (
    <div className="grow">
      {description}
      {requestUnclaimed && <span className="badge mx-1">Requested</span>}
      {requestClaimedByGuest &&
        (claimed_comment ? (
          <span className="badge badge-ghost mx-1">Claimed as:</span>
        ) : (
          <span className="badge badge-ghost mx-1">Claimed</span>
        ))}
      {claimed_comment}
    </div>
  );
  const contributor = (
    <div className="w-40 flex-none">
      {(committedByGuest || requestClaimedByGuest) && guest.display_name}
      {committedByHost && host.display_name}
    </div>
  );

  const actions = (
    <div className="flex-none">
      <div>{requested && !contributor_id ? claimButton : <ContributionOptionsButton />}</div>
    </div>
  );

  return (
    <div className="flex items-center border-t-[1px] border-zinc-200 bg-zinc-100 py-1 px-2 sm:mx-2">
      {item}
      {contributor}
      {actions}
    </div>
  );
}

function NewContributionForm({ contributions_frozen }: { contributions_frozen: boolean }) {
  const { session, user, sessionStale, signOut, signInWithMagicLink, signInWithGoogle } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { guest, setGuest, guestList, setGuestList } = useGuestAuth();
  const { event, setEvent } = useEventState();

  const isHost = user && user.id === event?.host_id;
  const isGuest = guest && !isHost; // let host account take precedence in event of a shared device
  const isSpectator = !isHost && !isGuest; // note, this could be an authenticated host account for a different event, or a non-authenticated page viewer.

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
        <div className=" flex w-full gap-2">
          <input type="text" placeholder="Add an item..." className="input input-bordered w-full" />
          {/* <div className="btn btn-primary text-3xl">🕊</div> */}
          <div className="btn gap-2">
            <p className="text-lg">Submit</p>
            {/* <p className="text-3xl">✍🏻</p> */}
          </div>
        </div>
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
        <div className=" flex w-full gap-2">
          <input
            type="text"
            placeholder="Add a request..."
            className="input input-bordered w-full"
          />
          {/* <div className="btn btn-primary text-3xl">🕊</div> */}
          <div className="btn gap-2">
            <p className="text-lg">Request</p>
            {/* <p className="text-3xl">✍🏻</p> */}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {!contributions_frozen && (
        <div className="px-2">
          {NewItemForm}
          {isHost && NewRequestForm}
        </div>
      )}
    </>
  );
}
